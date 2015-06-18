// basic Tip data entry
var tip = {"user_id": "xuIeFhoebXnwnO41wu1UXg", "text": "Really cool new hotel with lots going on. Bars and restaurants bursting with energy. Book a strip view if you can sleep thru anything!", "business_id": "AtjsjFzalWqJ7S9DUFQ4bw", "likes": 0, "date": "2011-05-01", "type": "tip"};

// storing all keys of Tip data for database creation
var tipArray = [];

for (var key in tip) {
  tipArray.push(key);
};