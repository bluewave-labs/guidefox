const { Op } = require('sequelize');
const db = require('../models');
const HelperLink = db.HelperLink;
const Link = db.Link;

class HelperLinkService {
  async getAllHelpers() {
    return await HelperLink.findAll();
  }

  async getAllHelpersWithLinks() {
    return await HelperLink.findAll({
      include: [
        {
          model: Link,
          as: 'links',
        },
      ],
    });
  }

  async getIncompleteHelpers(ids) {
    return await HelperLink.findAll({
      include: [
        {
          model: Link,
          as: 'links',
        },
      ],
      where: {
        id: { [Op.notIn]: ids },
      },
    });
  }

  async getHelpersByUserId(userId) {
    return await HelperLink.findAll({
      where: {
        createdBy: userId,
      },
    });
  }

  async createHelper(data, links) {
    const t = await db.sequelize.transaction();
    try {
      const newHelper = await HelperLink.create(data, {
        transaction: t,
        returning: true,
      });
      const updatedLinks = links.map((link) => {
        return { ...link, helperId: newHelper.id };
      });
      await Link.bulkCreate(updatedLinks, { transaction: t });
      t.commit();
      return newHelper;
    } catch (e) {
      console.log(e);
      await t.rollback();
      throw new Error('Error creating helper');
    }
  }

  async deleteHelper(id) {
    const rowsAffected = await HelperLink.destroy({ where: { id } });
    return rowsAffected !== 0;
  }

  async updateHelper(id, data, links) {
    const t = await db.sequelize.transaction();
    try {
      const [affectedRows, updatedHelper] = await HelperLink.update(data, {
        transaction: t,
        where: { id },
        returning: true,
      });
      if (affectedRows === 0) {
        t.commit();
        return null;
      }
      const linksToUpdate = links.filter((item) => item.id);
      const linksToCreate = links.filter((item) => !item.id).map((item) => ({ ...item, helperId: id }));
      if (linksToCreate.length > 0) await Link.bulkCreate(linksToCreate, { transaction: t });
      await Promise.all(
        linksToUpdate.map(async (item) => {
          const { id: linkId, ...link } = item;
          return await Link.update({ ...link, helperId: id }, { transaction: t, where: { id: linkId } });
        })
      );
      t.commit();
      return updatedHelper;
    } catch (e) {
      console.log(e);
      await t.rollback();
      throw new Error('Error updating helper');
    }
  }

  async getHelperById(helperId) {
    try {
      return await HelperLink.findOne({
        where: { id: helperId },
        include: [
          {
            model: db.Link,
            as: 'links',
          },
        ],
      });
    } catch (error) {
      throw new Error('Error retrieving helper by ID');
    }
  }
}

module.exports = new HelperLinkService();
