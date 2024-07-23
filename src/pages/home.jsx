import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center bg-gray-100 p-4">
                <div className="text-2xl font-bold">Logo</div>
                <div className="flex items-center">
                    <select className="border rounded p-2 mx-2">
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                    <button className="bg-yellow-400 text-white px-4 py-2 rounded">Tìm KIẾM</button>
                </div>
            </header>
            <main className="mt-4">
                <h1 className="text-xl font-semibold">Kênh thông tin Phòng Trọ số 1 Việt Nam</h1>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Danh sách tin đăng</h2>
                    <div className="bg-white shadow-md rounded-lg p-4 mt-2 flex">
                        <img src="image-url.jpg" alt="Room" className="w-1/3 rounded-lg" />
                        <div className="ml-4">
                            <h3 className="text-lg font-bold">Cho thuê phòng trọ tại Quang Trung</h3>
                            <p className="text-gray-700">3.5 triệu/tháng</p>
                            <p className="text-gray-700">22m²</p>
                            <p className="text-gray-700">Quận Gò Vấp, Hồ Chí Minh</p>
                            <button className="bg-yellow-400 text-white px-4 py-2 rounded mt-2">Gọi: 0999999999</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;