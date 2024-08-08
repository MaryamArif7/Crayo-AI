// lib/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const withAuth = (Component) => {
    return (props) => {
        const [user, loading, error] = useAuthState(auth);
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login');
            }
        }, [user, loading]);

        if (loading) {
            return <p>Loading...</p>;
        }

        if (user) {
            return <Component {...props} />;
        }

        return null;
    };
};

export default withAuth;
