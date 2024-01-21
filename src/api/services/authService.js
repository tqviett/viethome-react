import { createUserWithEmailAndPassword } from 'firebase/auth';
import Notification from 'ui-component/notification';
import { auth } from 'firebase';
import { SET_MENU } from 'store/actions';

export const register = async (body) => {
    const { email, password } = body;
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            navigate('/login');
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            <Notification type={'error'} message={errorMessage} />
        });
};
