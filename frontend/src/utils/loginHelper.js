
import { getTeamCount } from '../services/teamServices';
import toastEmitter, { TOAST_EMITTER_KEY } from './toastEmitter';

export const handleAuthSuccess = (response, loginAuth, navigate, redirectTo = null) => {
    const { id, name, surname, email, role, picture } = response.user;
    const payload = { id, name, surname, email, role, picture };
    // Emit toast notification
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Login successful');

    // Update authentication state
    loginAuth(payload);

    getTeamCount()
        .then(response => {
            const { teamExists } = response;
            if (!teamExists) {
                navigate('/progress-steps');
            } else if(redirectTo){
                navigate(redirectTo)
            }
            else {
                navigate('/');
            }
        })
        .catch(err => console.error(err));
};
