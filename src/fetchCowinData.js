const axios = require("axios");
const chalk = require("chalk");

const getDistrictSlotsData = async (selectedDate, districtCode, ageLimit) => {
    let availableSlotsCenter = [];
    try {
        const result = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtCode}&date=${selectedDate}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
            //This header is used to make mock call from browser
        });
        const centerData = result.data;
        centerData.centers.forEach(center => {
            center.sessions && center.sessions.forEach(session => {
                if (session.available_capacity > 0 && session.min_age_limit == ageLimit) {
                    availableSlotsCenter.push({
                        date: session.date,
                        capacity: session.available_capacity,
                        centerName: center.name,
                        age_limit: session.min_age_limit,
                        address : `${center.address}, ${center.block_name}`
                    });
                }

            });
        });

        return availableSlotsCenter;

    } catch (err) {
        console.log(chalk.red(err.message));
    }
};

const getDistrictId = async (pincode) => {
    try {
        const districtDetails = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        let isInvalidPinCode = districtDetails.data[0].Message === "No records found";
        if (isInvalidPinCode) {
            throw new Error("No result found for this pincode!, try with other nearest pincode");
        }
        const postalInfo = districtDetails.data && districtDetails.data[0].PostOffice[0];
        const { State, District } = postalInfo;
        const stateCode = await getStateCode(State);
        const districtCode = await getDistrictCode(stateCode, District);
        return districtCode;
    } catch (err) {
        console.log(chalk.red(err.message));
    }
}

const getStateCode = async (stateName) => {
    try {
        let statesDetail = await axios.get("https://cdn-api.co-vin.in/api/v2/admin/location/states", {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
            //This header is used to make mock call from browser
        });
        statesDetail = statesDetail.data.states;
        let currentState = statesDetail.filter(state => state.state_name == stateName);
        return currentState[0].state_id;
    } catch (err) {
        console.log(chalk.red(err.message));
    }
}

const getDistrictCode = async (stateCode, districtName) => {
    try {
        let districtDetails = await axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateCode}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
            //This header is used to make mock call from browser
        });
        districtDetails = districtDetails.data.districts;
        const currentDistrictDetail = districtDetails.filter(district => district.district_name == districtName);
        return currentDistrictDetail[0].district_id;
    } catch (err) {
        console.log(chalk.red(err.message));
    }
}

module.exports = {
    getDistrictSlotsData,
    getDistrictId
}