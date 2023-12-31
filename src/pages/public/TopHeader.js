/** @format */

import React, { memo, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeadlessTippy from '@tippyjs/react/headless';

import logo from '../../assets/logo-phongtro.png';
import icons from '../../ultils/icons';
import { path } from '../../ultils/path';
import { MENUMANAGE } from '../../ultils/contants';
import withBaseComp from '../../hocs/withBaseComp';
import { clearMessage, logout } from '../../store/user/userSlice';
import { getCurrent } from '../../store/user/asyncActions';
import { showMenu } from '../../store/app/appSlice';
import { clsx } from 'clsx';
import { ContextEnvironment } from '../../components/common/ContextProvider';

const TopHeader = ({ dispatch, navigate }) => {
    const { AiOutlineHeart, AiOutlineUserAdd, AiOutlineLogout, AiOutlinePlusCircle, RiListCheck2, BiLogOut, IoMdMenu } =
        icons;
    const { isLoggedIn, dataUser, mess } = useSelector(state => state.user);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const { resize } = useContext(ContextEnvironment);

    useEffect(() => {
        if (isLoggedIn) {
            const dispatchUser = setTimeout(() => {
                dispatch(getCurrent());
            }, 300);
            return () => {
                clearTimeout(dispatchUser);
            };
        }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (mess)
            Swal.fire({
                title: 'Đăng nhập thất bại',
                text: mess,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oki',
            }).then(result => {
                if (result.isConfirmed) {
                    navigate(`${path.LOGIN}`);
                    dispatch(clearMessage());
                }
                if (result.isDismissed) {
                    dispatch(clearMessage());
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mess]);

    const handleLogout = () => {
        setIsShowMenu(false);
        Swal.fire({
            title: 'Bạn chắc chứ ?',
            text: 'Bạn muốn đăng xuất !',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý !',
        }).then(rs => {
            if (rs.isConfirmed) {
                dispatch(logout());
                setIsShowMenu(false);
            }
        });
    };

    return (
        <div className={clsx(resize && 'fixed top-0 left-0 right-0 z-40', 'w-full bg-[white]')}>
            <div className="w-full flex justify-center">
                <div className="w-main">
                    <div className="px-[10px] lg:px-0 flex justify-between">
                        <Link to={`${path.HOME}`}>
                            <img
                                loading="lazy"
                                className="w-[240px] h-[50px] lg:h-[70px] object-contain"
                                alt=""
                                src={logo}
                            ></img>
                        </Link>
                        <div onClick={() => dispatch(showMenu())} className="flex items-center lg:hidden">
                            <IoMdMenu size={30} />
                            <span>Danh mục</span>
                        </div>
                        <div className="hidden lg:flex items-center">
                            {isLoggedIn && (
                                <div className="flex items-center text-sm mr-[20px]">
                                    <img
                                        loading="lazy"
                                        src={dataUser?.avatar}
                                        className="min-w-[30px] h-[30px] rounded-full object-cover mr-[10px]"
                                        alt=""
                                    />

                                    <span>
                                        Xin Chào,
                                        <span className="font-semibold text-[16px] ml-[5px]">{dataUser?.name}</span>
                                    </span>
                                </div>
                            )}
                            <span className="flex items-center text-sm cursor-pointer hover:underline mr-[20px]">
                                <span className="mr-[5px]">
                                    <AiOutlineHeart size={20} />
                                </span>
                                Yêu Thích
                            </span>
                            {isLoggedIn && (
                                <div>
                                    <HeadlessTippy
                                        placement="bottom"
                                        visible={isShowMenu}
                                        interactive
                                        onClickOutside={() => setIsShowMenu(false)}
                                        render={attrs => (
                                            <div
                                                tabIndex="-1"
                                                {...attrs}
                                                className="w-[200px] bg-white shadow-xl rounded-xl overflow-hidden"
                                            >
                                                <div className="flex flex-col px-[20px] py-[10px]">
                                                    {MENUMANAGE.map(item => (
                                                        <Link
                                                            className={clsx(
                                                                'py-[10px]  hover:text-secondary flex items-center gap-3 border-b'
                                                            )}
                                                            to={item.path}
                                                            key={item.id}
                                                        >
                                                            <span>{item.icon}</span>
                                                            {item.des}
                                                        </Link>
                                                    ))}
                                                    <div
                                                        onClick={handleLogout}
                                                        className={clsx(
                                                            'py-[10px]  hover:text-secondary flex items-center gap-3 cursor-pointer'
                                                        )}
                                                    >
                                                        <span>
                                                            <BiLogOut />
                                                        </span>
                                                        Thoát
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    >
                                        <div
                                            onClick={() => setIsShowMenu(true)}
                                            className="flex items-center text-sm cursor-pointer hover:underline mr-[20px] relative"
                                        >
                                            <span className="mr-[5px]">
                                                <RiListCheck2 size={20} />
                                            </span>
                                            Quản lý tài khoản
                                        </div>
                                    </HeadlessTippy>
                                </div>
                            )}
                            {!isLoggedIn && (
                                <>
                                    <Link
                                        to={`/${path.LOGIN}`}
                                        className="flex items-center text-sm cursor-pointer hover:underline mr-[20px]"
                                    >
                                        <span className="mr-[5px]">
                                            <AiOutlineUserAdd size={20} />
                                        </span>
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to={`/${path.REGISTER}`}
                                        className="flex items-center text-sm cursor-pointer hover:underline mr-[20px]"
                                    >
                                        <span className="mr-[5px]">
                                            <AiOutlineLogout size={20} />
                                        </span>
                                        Đăng ký
                                    </Link>
                                </>
                            )}
                            <Link
                                to={isLoggedIn ? `/${path.MANAGE}/${path.NEW_POST}` : `/${path.LOGIN}`}
                                className="flex items-center text-sm cursor-pointer hover:underline p-2 bg-secondary rounded-lg text-white"
                            >
                                Đăng tin mới
                                <span className="ml-[5px]">
                                    <AiOutlinePlusCircle size={20} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withBaseComp(memo(TopHeader));
