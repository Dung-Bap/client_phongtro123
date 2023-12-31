/** @format */

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Pagination from 'rc-pagination';
import { createSearchParams, useLocation, useSearchParams } from 'react-router-dom';

import { Header, SelectProvinceItem } from '../../components/header';
import { AsideItem, News, PostItem } from '../../components/main';
import { Search } from './';
import { getAcreages, getCategories, getPosts, getPrices, getProvinces } from '../../store/app/asyncActions';
import { convertPath } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import withBaseComp from '../../hocs/withBaseComp';
import clsx from 'clsx';
import { path } from '../../ultils/path';

const Home = ({ dispatch, navigate, location }) => {
    const { MdKeyboardArrowRight, MdKeyboardArrowLeft } = icons;
    const { posts, categories, prices, acreages, isLoading } = useSelector(state => state.app);
    const { state } = useLocation();
    const currentPageRef = useRef();
    const pageRef = useRef();
    const [params] = useSearchParams();
    const [categoryCode, setCategoryCode] = useState('');
    const [update, setUpdate] = useState(false);
    const [size, setSize] = useState(6);
    const [current, setCurrent] = useState(1);
    const [searchProvince, setSearchProvince] = useState();
    const [created, setCreated] = useState('star');
    // Pagination
    const PerPageChange = value => {
        setSize(value);
        const newPerPage = Math.ceil(posts?.count / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    };

    const PaginationChange = (page, pageSize) => {
        setCurrent(page);
        setSize(pageSize);
        const queries = Object.fromEntries([...params]);
        queries.page = page;
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });
    };

    const PrevNextArrow = (current, type, originalElement) => {
        if (type === 'prev')
            <button>
                <MdKeyboardArrowLeft size={20} />
            </button>;
        if (type === 'next')
            <button>
                <MdKeyboardArrowRight size={20} />
            </button>;
        return originalElement;
    };

    useEffect(() => {
        const queries = {};
        if (searchProvince) {
            queries.provinceCode = searchProvince.cateCode;
            navigate(
                {
                    pathname: path.HOME,
                    search: createSearchParams(queries).toString(),
                },
                {
                    state: {
                        title: `${searchProvince.title}, Nhà Trọ Giá Rẻ, Mới Nhất 2023`,
                        des: `${searchProvince.title}, nhà trọ giá rẻ mới nhất năm 2023: mới xây, không chung chủ, vệ sinh riêng. Tìm phòng trọ ở Hồ Chí Minh với nhiều diện tích, mức giá khác nhau.`,
                    },
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchProvince]);
    //
    useEffect(() => {
        setCategoryCode(categories?.find(item => `/${convertPath(item?.value)}` === location.pathname)?.code);
    }, [categories, location.pathname]);

    useEffect(() => {
        setTimeout(() => {
            currentPageRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 200);

        const queries = Object.fromEntries([...params]);
        queries.order = [created, 'DESC'];
        if (categoryCode) {
            queries.categoryCode = categoryCode;
        }
        dispatch(getPosts(queries));
        dispatch(getCategories());
        dispatch(getAcreages());
        dispatch(getPrices());
        dispatch(getProvinces());
        setSearchProvince(null);
    }, [categoryCode, dispatch, params, update, created]);

    useEffect(() => {
        setCurrent(+params.get('page') || 1);
    }, [categoryCode, params, update]);

    useEffect(() => {
        setTimeout(() => {
            pageRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 200);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.get('page'), update]);

    return (
        <div className="w-full">
            <Search currentPageRef={currentPageRef} setUpdate={setUpdate} />
            {!state && (
                <>
                    <Header
                        title={
                            categories?.find(item => `/${convertPath(item?.value)}` === location.pathname)?.header ||
                            'Kênh thông tin Phòng Trọ số 1 Việt Nam'
                        }
                        des={
                            categories?.find(item => `/${convertPath(item?.value)}` === location.pathname)?.subheader ||
                            'Kênh thông tin Phòng Trọ số 1 Việt Nam - Website đăng tin cho thuê phòng trọ, nhà nguyên căn, căn hộ, ở ghép nhanh, hiệu quả với 100.000+ tin đăng và 2.500.000 lượt xem mỗi tháng.'
                        }
                    />
                    <div className="px-[10px] sm:px-0 w-full flex justify-center gap-4 mb-[25px]">
                        <SelectProvinceItem
                            title={'Phòng trọ Hồ Chí Minh'}
                            image={'https://phongtro123.com/images/location_hcm.jpg'}
                            setSearchProvince={setSearchProvince}
                            cateCode={'CHMN'}
                        />

                        <SelectProvinceItem
                            title={'Phòng trọ Hà Nội'}
                            image={'https://phongtro123.com/images/location_hn.jpg'}
                            setSearchProvince={setSearchProvince}
                            cateCode={'NNIT'}
                        />

                        <SelectProvinceItem
                            title={'Phòng trọ Đà Nẵng'}
                            image={'https://phongtro123.com/images/location_dn.jpg'}
                            setSearchProvince={setSearchProvince}
                            cateCode={'NONG'}
                        />
                    </div>
                </>
            )}
            {state && <Header title={state.title} des={state.des} />}
            <div className="w-full flex justify-center">
                <main ref={pageRef} className="w-full lg:w-main lg:flex gap-4 scroll-m-[60px]">
                    <section className="w-full lg:w-[68%]">
                        <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
                            <div className="w-full p-[20px]">
                                <h1 className="mb-[8px] text-[18px] font-semibold">{`Tổng ${
                                    posts?.count || 0
                                } kết quả`}</h1>
                                <div className="flex items-center">
                                    <span className="mr-[10px] text-[14px]">Sắp xếp:</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            onClick={() => setCreated('star')}
                                            className={clsx(
                                                created === 'star' && 'text-secondary border border-secondary',
                                                'p-[4px] bg-gray-100 rounded-md text-[14px] cursor-pointer border'
                                            )}
                                        >
                                            Mặc định
                                        </span>
                                        <span
                                            onClick={() => setCreated('createdAt')}
                                            className={clsx(
                                                created === 'createdAt' && 'text-secondary border border-secondary',
                                                'p-[4px] bg-gray-100 rounded-md text-[14px] cursor-pointer border'
                                            )}
                                        >
                                            Mới nhất
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {posts?.count <= 0 && (
                                <span className="w-full text-center flex justify-center items-center min-h-[200px] font-medium text-[16px]">
                                    Hiện tại chưa có bài đăng nào phù hợp với thông tin của bạn !!!
                                </span>
                            )}
                            {posts?.count > 0 &&
                                posts?.rows?.map(post =>
                                    isLoading ? (
                                        <PostItem.Loading
                                            key={post.id}
                                            post={post}
                                            image={JSON.parse(post.images.image)}
                                        />
                                    ) : (
                                        <PostItem key={post.id} post={post} image={JSON.parse(post.images.image)} />
                                    )
                                )}
                        </div>
                        {posts?.count > 0 && (
                            <div className="w-full flex justify-center p-[20px] overflow-hidden">
                                <Pagination
                                    className="pagination-data"
                                    // showTotal={(total, range) => `Kết quả ${range[0]}-${range[1]} của ${total}`}
                                    onChange={PaginationChange}
                                    total={posts?.count}
                                    current={current}
                                    pageSize={size}
                                    showSizeChanger={false}
                                    itemRender={PrevNextArrow}
                                    onShowSizeChange={PerPageChange}
                                />
                            </div>
                        )}
                    </section>
                    <section className="lg:w-[32%]">
                        <div className="hidden lg:block">
                            <AsideItem
                                setUpdate={setUpdate}
                                title={'Danh mục cho thuê'}
                                contents={categories}
                                categoryCode={categoryCode}
                            />
                            <AsideItem
                                custom
                                setUpdate={setUpdate}
                                type="priceCode"
                                title={'Xem theo giá'}
                                contents={prices}
                            />
                            <AsideItem
                                custom
                                setUpdate={setUpdate}
                                type="acreageCode"
                                title={'Xem theo diện tích'}
                                contents={acreages}
                            />
                        </div>
                        <div className="w-full">
                            <News />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default withBaseComp(Home);
