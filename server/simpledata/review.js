// basic Review data entry
var review = {"votes": {"funny": 1, "useful": 1, "cool": 1}, "user_id": "mPP-Li-O42qFC7c_jm-osg", "review_id": "iGP0WmdX9exmZFJfPOZVAA", "stars": 2, "date": "2013-09-07", "text": "Mediocre sandwiches and milk shakes. Also, the woman behind the counter was very rude and had a terrible attitude.", "type": "review", "business_id": "DJKpwLp4mISNDNDpNz67tw"};

// storing all keys of Review data for database creation
var reviewArray = [];

for (var key in review) {
  reviewArray.push(key);
};