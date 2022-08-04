import React, {useEffect, useState} from 'react'
import {Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import './App.css';
import {Box, Button, Container, Grid, Stack, Typography} from "@mui/material";
import TextField from '@mui/material/TextField';
import axios from "axios";
import conf from "./conf.json"
import {useDispatch, useSelector} from "react-redux";
import jwt_decode from "jwt-decode"
import {login, logout} from "./features/user/userSlice";
import cookie from 'react-cookies'
import SurveyCardAdd from "./features/survey/components/SurveyCardAdd";

const config = conf


function App() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    useEffect(() => {
        let ignore = false
        const timestamp = Date.parse(new Date()) / 1000
        const refresh = cookie.load(`refresh`)
        const uid = cookie.load('uid')

        async function get_csrf() {
            const csrf = await axios.get('/api/accounts/get_csrf_token')
            if (!ignore) {
                cookie.save('csrftoken', csrf.data.csrf_token, '/')
            }
        }

        async function refresh_token(p) {
            console.log(p)
            const access = await axios.post(`/api/token/refresh/`, {
                refresh: p
            })
            if (!ignore) {
                cookie.save('access', access.data.access, '/')
                const newInfo = jwt_decode(access.data.access)
                dispatch(login({
                    ...newInfo, isLogin: true
                }))
                cookie.save('uid', newInfo.uid, '/')  // 用户id
                cookie.save('access', access.data.access, '/')
                cookie.save('refresh', refresh, '/')
            }
        }

        if (uid && refresh) {
            // 有用户信息
            const info = jwt_decode(refresh)
            if (timestamp > info.exp) {
                // 过期
                console.log(timestamp, info)
                navigate('/user/login')
            } else {
                // 未过期
                // 直接refresh token
                refresh_token(refresh)
            }
        } else {
            // 无用户信息，pass
            if (config.debug) {
                get_csrf()
            }
            navigate('/user/login')
        }
        return () => {
            ignore = true;
        };
    }, [])

    return (<div className="App" style={{minHeight: '100vh'}}>
        <Routes>
            <Route path={`/`} element={<Home/>}>
            </Route>
            <Route path={'/survey'} element={<Survey/>}>
            </Route>
            <Route path={`/user`} element={<User/>}>
                <Route path={`login`} element={<Login/>}/>
                <Route path={`logout`} element={<Logout/>}/>
                <Route path={`sign-up`} element={<SignUp/>}/>
                <Route path={`management`} element={<UserManager/>}>
                    <Route path={`reset-passwd`} element={<PasswdReset/>}/>
                </Route>
            </Route>
        </Routes>
    </div>)
}

function Home() {
    const user = useSelector(state => state.user)
    const welcome = user.isLogin ? `welcome ${user.uid}` : `not login`
    const topLinks = () => {
        // 顶部登录选项
        if (user.isLogin) {
            return (
                <>
                    <NavLink to={'/user/management'}>
                        <Typography variant={`body2`} component={`span`} children={'用户管理'}/>
                    </NavLink>
                    <NavLink to={'/user/logout'}>
                        <Typography variant={`body2`} component={`span`} children={'登出'}/>
                    </NavLink>
                    <NavLink to={'/'}>
                        <Typography variant={`body2`} component={`span`} children={'首页'}

                        />
                    </NavLink>
                </>
            )
        } else {
            return (
                <>
                    <NavLink to={'/user/sign-up'}>
                        <Typography variant={`body2`} component={`span`} children={'注册'}
                                    style={{visibility: user.isLogin ? 'hidden' : 'visible'}}
                        />
                    </NavLink>

                    <NavLink to={'/user/login'}>
                        <Typography variant={`body2`} component={`span`} children={'登录'}
                                    style={{visibility: user.isLogin ? 'hidden' : 'visible'}}/>
                    </NavLink>
                    <NavLink to={'/'}>
                        <Typography variant={`body2`} component={`span`} children={'首页'}
                        />
                    </NavLink>
                </>
            )
        }

    }
    return (
        <Grid container direction={`column`}
              alignItems={`stretch`}
              sx={{height: '100%', width: '100%', padding: 0}}>
            <Grid item xs={1} sx={{
                backgroundColor: '#e3e4e5', borderBottom: 'solid 1px #ddd',

            }}>
                <Stack
                    direction="row-reverse"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        paddingInlineEnd: '20px'
                    }}
                >
                    {topLinks()}
                    头部导航栏, 仅home 下，注册用空标头
                </Stack>
            </Grid>
            <Grid item xs>
                <>
                    'home'
                    {welcome}
                    <p>
                        滚动图片部分
                    </p>
                    <p>
                        列表部分
                        <ul>
                            <li>
                                <NavLink to={`/survey`}>
                                    创建项目
                                </NavLink>
                            </li>
                        </ul>
                    </p>
                    <Outlet/>
                </>
            </Grid>
        </Grid>
    )
}



function Survey() {
    // 新的标题栏（控制台）

    return (

        <Grid container
              direction={`column`}
              justifyContent={`center`}
              alignItems={`stretch`}
              className={`survey-main-panel`}
        >
            <Grid item xs={2}>
                tabs
            </Grid>
            <Grid item xs={10}>
                <SurveyCardAdd/>
            </Grid>
        </Grid>
    )
}

function User() {
    return (<>
        <Outlet/>
    </>)
}

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [values, setValues] = useState({
        username: '', password: '',
    })
    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    function handleClick() {
        if (values.username !== '' && values.password !== '') {
            axios({
                method: 'post', url: `/api/accounts/token/`, data: {
                    username: values.username, password: values.password
                }
            }).then((res) => {
                const info = jwt_decode(res.data.access)
                dispatch(login({
                    ...info, isLogin: true
                }))
                cookie.save('uid', info.uid, '/')
                cookie.save('access', res.data.access, '/')
                cookie.save('refresh', res.data.refresh, '/')
                navigate('/')
            }).catch((err) => {
                // popup user login error
                console.log(err)
            })
        }
    }

    return (<Box sx={{
        width: 300, height: 300, alignContent: 'center', margin: 30
    }}>
        <Stack>
            <TextField id={`username`} label={`用户名`} variant={`standard`} margin={`normal`}
                       value={values.username}
                       onChange={handleChange(`username`)}
            />
            <TextField id={`password`} label={`密码`} variant={`standard`} margin={`normal`}
                       value={values.password} type={`password`}
                       onChange={handleChange(`password`)}
            />
            <Button onClick={handleClick}>
                登录
            </Button>
        </Stack>
    </Box>)
}

function PasswdReset() {
    return ('reset password')
}

function SignUp() {
    return ('sign-up')
}

function UserManager() {
    return ('self management')
}

function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        cookie.remove('uid', {domain: 'localhost'})
        cookie.remove('access', {domain: 'localhost'})
        cookie.remove('refresh', {domain: 'localhost'})
        cookie.remove('csrftoken', {domain: 'localhost'})
        dispatch(logout())
        navigate('/')
    }, [])
    return (
        'logout'
    )
}

export default App;
