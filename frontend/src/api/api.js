import api from './request';

export const getStation = () => {
    return api.get('/trains/station');
};

export const getSearchResult = (startCity, arriveCity, date, isGD, sortType, seatType, isHide, userID) => {
    const queryString = `?is_GD=${isGD}&sort_type=${sortType}&seat_type=${seatType}&isHide=${isHide}`;
    const start = encodeURIComponent(startCity);
    const arrive = encodeURIComponent(arriveCity);
    return api.post(`/trains/trains/${start}/${arrive}/${date}/${userID}${queryString}`);
};

export const getFoods = (userID, tid, date, time) => {
    return api.get(`/foods/food/${userID}/${tid}/${date}/${time}`);
};

export const getThisTicket = (userID, status) => {
    const queryString = `?status=${status}`;
    return api.get(`/trains/getTid/${userID}${queryString}`);
};
/*提交火车餐表单*/
export const postFoodBill = (foods, userID, tid, date, time, sum_price) => {
    var foodss = JSON.parse(foods);
    console.log("foodss:", foodss);
    return api.post(`/foods/food/bill`,
        {
            "foods": foodss,
            "userID": userID,
            "tid": tid,
            "date": date,
            "time": time,
            "sum_price": sum_price
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
}
/*获取火车餐订单*/
export const getFoodOrders = (userID, status) => {
    return api.get(`/foods/food/orders/${userID}/${status}`);
}

/*取消火车餐订单*/
export const cancelFoodOrder = (userID, oid) => {
    // return api.post(`/food/cancel/${userID}/${oid}`);
    var nowtime = new Date();
    return api.post(`/foods/food/cancel/${userID}/${oid}`,
        {
            "cancel_time": nowtime,
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
}

/*删除火车餐订单*/
export const deleteFoodOrder = (userID, oid) => {
    return api.post(`/foods/food/delete/${userID}/${oid}`);
}

export const getPassengers = (id) => {
    return api.post(`/trains/passengersInfo/${id}`);
};

/* 删除乘车人 */
export const deletePassengers = (id, name, identification) => {
    const queryString = `?name=${encodeURIComponent(name)}&identification=${identification}`;
    return api.post(`/trains/deletePassengers/${id}${queryString}`);
};

export const updatePassengers = (id, oldidentification, newname, newidentification, newphone) => {
    const queryString = `?oldidentification=${oldidentification}&newname=${newname}&newidentification=${newidentification}&newphone=${newphone}`;
    return api.post(`/trains/updatePassengers/${id}${queryString}`);
};

export const insertPassengers = (id, name, identification, phone) => {
    const queryString = `?name=${name}&identification=${identification}&phone=${phone}`;
    return api.post(`/trains/insertPassengers/${id}${queryString}`);
};

/*提交火车票订单*/
export const postTicketBill = (persons, userID, tid, date, sum_price) => {
    var person = JSON.parse(persons);
    return api.post(`/trains/ticket/bill`,
        {
            "person": person,
            "userID": userID,
            "tid": tid,
            "date": date,
            "sum_price": sum_price
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
}

/*获取火车票订单*/
export const getTicketOrders = (userID, status) => {
    return api.get(`/trains/ticket/orders/${userID}/${status}`);
}

/*取消火车票订单*/
export const cancelTicketOrder = (userID, oid) => {
    return api.post(`/trains/ticket/cancel/${userID}/${oid}`);
}
/*获取用户所有消息*/
export const getMessage = (userID) => {
    return api.get(`/users/message/getAll/${userID}`)
}

/*标记消息已读*/
export const haveReadMessage = (mid) => {
    return api.post(`/users/message/setRead/${mid}`)
}
/*全部已读*/
export const haveReadAllMessage = (userID) => {
    return api.post(`/users/message/setAllRead/${userID}`)
}
/*城市查询*/
export const getPlaces = () => {
    return api.get('/hotels/getPlaces');
};
/*获取酒店组*/
export const getHotel = (arrive_station, arrive_date, Ideparture_date, sort_type) => {
    const queryString = `?sort_type=${sort_type}`;
    return api.get(`/hotels/hotel/${arrive_station}/${arrive_date}/${Ideparture_date}${queryString}`);
};

/*获取酒店详细信息*/
export const getHotelDetail = (hotel_id, double_choose, big_choose, family_choose, check_in, check_out) => {
    const queryString = `?hotel_id=${encodeURIComponent(hotel_id)}&double_choose=${encodeURIComponent(double_choose)}&big_choose=${encodeURIComponent(big_choose)}&family_choose=${encodeURIComponent(family_choose)}&check_in=${encodeURIComponent(check_in)}&check_out=${encodeURIComponent(check_out)}`;
    return api.get(`/hotels/hotel_detail${queryString}`);
}

/*酒店支付*/
export const postHotelBill = (hotelid, id, checkin_time, checkout_time, room_num, room_type, customers, money) => {
    return api.post(`/hotels/hotel/bill`,
        {
            "hotel_id": hotelid,
            "id": id,
            "checkin_time": checkin_time,
            "checkout_time": checkout_time,
            "room_num": room_num,
            "room_type": room_type,
            "customers": customers,
            "money": money
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    )
}
/*酒店订单获取*/
export const getHotelOrders = (userID, status) => {
    return api.get(`/hotels/hotel/orders/${userID}/${status}`)
}
/*酒店订单取消*/
export const cancelHotelOrder = (userID, oid) => {
    return api.post(`/hotels/hotel/cancel/${userID}/${oid}`);
}

/*提交个人注册信息*/
export const postRegister = (userID, name, password, email, time) => {
    return api.post(`/users/register`, {
        "id": userID,
        "name": name,
        "password": password,
        "email": email,
        "time": time
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/*登陆*/
export const postLogin = (userID, password) => {
    return api.post(`/users/login`,
        {
            "id": userID,
            "password": password
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
}

/*获取验证码*/
export const postCode = (email) => {
    return api.post(`/users/idCode/${email}`)
}

/*验证码验证结果*/
export const postCodeVeryfication = (code, email) => {
    return api.post(`/users/idCode/${code}/${email}`);
}

/*更新密码 */
export const updatePassword = (userID, newPassword, confirm) => {
    return api.post(`/users/updatepassword`,
        {
            "id": userID,
            "newpassword": newPassword,
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
}
export const getbackPassword = (id) => {
    return api.get(`/users/getbackPassword/${id}`);
}

export const idCodeVerification = (idcode, id) => {
    return api.post(`/users/id/idCode/${idcode}/${id}`);
}