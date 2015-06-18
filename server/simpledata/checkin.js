// basic Checkin data entry
var checkin{"checkin_info": {"9-5": 1, "7-5": 1, "13-3": 1, "17-6": 1, "13-0": 1, "17-3": 1, "10-0": 1, "18-4": 1, "14-6": 1}, "type": "checkin", "business_id": "cE27W9VPgO88Qxe4ol6y_g"};

// storing all Checkin keys of data for database creation
var checkinArray = [];

for (var key in checkin) {
  checkinArray.push(key);
};