import React from 'react';
import useAdminAccess from '../../utils/useAdminAccess';

const Admin = () => {
    const { isAllowed, ToastContainer } = useAdminAccess();

    if (!isAllowed) return <h1>Loading or Not Authorized...</h1>;

    return (
        <>
            <ToastContainer />
            <h1>This is the admin protected route</h1>
        </>
    );
}

export default Admin;
