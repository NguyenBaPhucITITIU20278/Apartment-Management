import home from '../pages/home';
import login from '../pages/login';
import register from '../pages/register';
import rentroom from '../pages/rentroom';
import resetpassword from '../pages/resetPassword';

export const routes = [
    {
        path: '/',
        page: home,
        title: 'Home',
        description: 'Home page',
        header: true,
        background: true,
        role: 'user'
    },
    {
        path: '/login',
        page: login,
        title: 'Login Page',
        description: 'Login page',
        header: false,
        background: false,
        role: 'user'
    },
    {
        path: '/register',
        page: register,
        title: 'Register Page',
        description: 'Register page',
        header: false,
        background: false,
        role: 'user'
    },
    {
        path: '/rentroom',
        page: rentroom,
        title: 'Rent Room Page',
        description: 'Rent Room page',
        header: true,
        background: true,
        role: 'user'
    },
    {
        path: '/resetpassword',
        page: resetpassword,
        title: 'Reset Password Page',
        description: 'Reset Password page',
        header: false,
        background: false,
        role: 'user'
    }
]