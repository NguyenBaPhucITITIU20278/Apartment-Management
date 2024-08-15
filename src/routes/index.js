import home from '../pages/home';
import login from '../pages/loginUser';
import register from '../pages/register';
import rentroom from '../pages/rentroom';
import resetpassword from '../pages/resetPassword';
import adminControl from '../pages/adminControl';
import loginAdmin from '../pages/loginAdmin';
import News from '../pages/News'
import NewsDetail from '../pages/NewsDetail'
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
        path: '/loginAdmin',
        page: loginAdmin,
        title: 'Login Admin Page',
        description: 'Login Admin page',
        header: false,
        background: false,
        role: 'admin'
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
    },
    {
        path: '/adminControlUser',
        page: adminControl,
        title: 'Admin Page',
        description: 'Admin page',
        header: true,
        background: true,
        role: 'admin'
    },
    {
        path: '/news',
        page: News,
        tittle: 'News',
        description: 'News',
        header: true,
        background: true,
        role: 'user'
    },
    {
        path: '/news/:id',
        page: NewsDetail,
        tittle: 'News Detail',
        description: 'News Detail',
        header: true,
        background: true,
        role: 'user'
    }

]