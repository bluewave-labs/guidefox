const { where } = require("sequelize");
const settings = require("../../config/settings");
const db = require("../models");
const Team = db.Team;
const User = db.User;
const Token = db.Token;
const Invite = db.Invite;
const sequelize = db.sequelize;

class TeamService {
    async createTeam(name) {
        const transaction = await sequelize.transaction();

        try {
            const team = await Team.create({ name }, { transaction });
            await transaction.commit();
            return team;
        } catch (err) {
            await transaction.rollback();
            throw new Error("Failed to create team");
        }
    }

    async getTeam() {
        try {
            const team = await Team.findOne({
                limit: 1,
            });
            const users = await User.findAll();
            return { team, users };
        }
        catch (err) {
            throw new Error("Failed to retrieve team");
        }
    }

    async getTeamCount() {
        try {
            const teamCount = await Team.count();
            return { teamExists: teamCount > 0 };
        } catch (err) {
            throw new Error("Failed to get team count");
        }
    };

    async fetchServerUrl() {
        try {
            const { serverUrl, agentUrl } = await Team.findOne();
            return { serverUrl, agentUrl };
        } catch (err) {
            throw new Error("Failed to fetch server url");
        }
    }

    async addUrl(serverUrl, agentUrl) {
        const transaction = await sequelize.transaction();
        try {
            await Team.update({
                serverUrl,
                agentUrl
            }, { where: {} }, { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error("Failed to add server and base url")
        }
    }

    async updateTeam(name) {
        const transaction = await sequelize.transaction();
        try {
            await Team.update({
                name: name
            }, {
                where: {}
            }, {
                transaction
            });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new Error("Error Updating Team");
        }
    }

    async removeUserFromTeam(userId, memberId) {
        const transaction = await sequelize.transaction();
        try {
            if (userId == memberId) {
                throw new Error("User can't remove itself through team list");
            }

            const member = await User.findOne({
                where: { id: memberId }
            })
            if (!member) {
                throw new Error("User to be removed not found")
            }

            await User.destroy({
                where: { id: memberId },
                transaction
            })
            await Token.destroy({
                where: { userId: memberId },
                transaction
            });
            await Invite.destroy({
                where: { invitedBy: memberId },
                transaction
            });

            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            throw new Error(`Failed to remove user from team ~ ${err.message}`);
        }
    }

    async updateUserRole(memberId, role) {
        const transaction = await sequelize.transaction();
        try {
            const member = await User.findOne({
                where: { id: memberId }
            });
            if (!member) {
                throw new Error("User Not Found")
            }

            if (member.role == settings.user.role.admin && settings.user.role[role] != settings.user.role.admin) {
                const adminCount = await User.count({
                    where: { role: settings.user.role.admin }
                });
                if (adminCount <= 1) {
                    throw new Error("The team has only single admin and its role can't be changed");
                }
            }

            await User.update({
                role: settings.user.role[role]
            }, {
                where: { id: memberId }
            }, {
                transaction
            })
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            throw new Error(`Failed to update user role ~ ${err.message}`);
        }
    }
}

module.exports = TeamService;
