
import React, { useEffect, useState } from 'react';
import { TextField, MenuItem } from '@mui/material'; // Correct imports from MUI
import Box from '@mui/material/Box';
import Nav from "../../nav/Nav";
// import './Review.css';
import Footer from "../../nav/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material"
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import Relation from '../age/Relation';
import Quotationfamily from '../qotation/Quotationfamily';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';


function Review({ insuranceType, ploicyHolderName, insuredMembers }

) {
  const navigate = useNavigate();
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [userData, setuserData] = useState([])

  const membersFromState = useSelector((state) => state.relations.insuredMembers);
  const userdata = useSelector((state) => state.relations.storeDataOfUser);

  console.log("userdata:", userdata);

  let data;
  if (userdata) {
    if (typeof userdata === "string") {
      try {
        data = JSON.parse(userdata);
      } catch (error) {
        console.error("Failed to parse userdata:", error);
        data = [];
      }
    } else if (typeof userdata === "object") {
      data = userdata; // Already an object
    } else {
      data = [];
    }
  } else {
    data = [];
  }
  console.log("Parsed Data:", data);

  if (typeof userdata === "string") {
    // Only parse if it's a JSON string
    const parsedData = JSON.parse(userdata);
    console.log(parsedData);
  }




  const [selectedYear, setSelectedYear] = useState(0);

  const sumAssured = useSelector((state) => state.relations.sumAssured1);
  const finalPremium = useSelector((state) => state.relations.finalPremium1);
  const year = useSelector((state) => state.relations.selectedDuration1);

  // const sumAssured = useSelector((state) => state.relations.sumAssured) || 0;
  console.log(useSelector((state) => state.relations.sumAssured1));
  console.log(useSelector((state) => state.relations.finalPremium1));
  console.log(sumAssured, finalPremium, year)

  useEffect(() => {
    if (year == "1 Year") { setSelectedYear(1) }
    else if (year == "2 Years") { setSelectedYear(2) }
    else { setSelectedYear(3) }
  });

  const [startDate, setStartDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");

  useEffect(() => {
    // Set the start date to the current date
    const today = new Date();
    const formattedStartDate = today.toISOString().split("T")[0];
    setStartDate(formattedStartDate);

    // Calculate the renewal date based on selectedYear
    const renewal = new Date(today);
    renewal.setFullYear(today.getFullYear() + selectedYear);
    renewal.setDate(renewal.getDate() - 1); // Subtract 1 day
    const formattedRenewalDate = renewal.toISOString().split("T")[0];
    setRenewalDate(formattedRenewalDate);
  }, [selectedYear]); // Recalculate when selectedYear changes

  const [costumerdetails, setcustomerdetails] = useState([]);



  const value = Cookies.get("MobileNumber");

  useEffect(() => {
    axios.get('http://183.82.106.55:9100/register/fetch/' + value).then((res) => {
      // console.log(res.data);
      setcustomerdetails(res.data);
    }, [value])
  });

  // console.log(costumerdetails.fullName);
  Cookies.set("UserDetails", costumerdetails.gender);
  // console.log(Cookies.get('UserDetails'))
  Cookies.set('insuranceType', insuranceType);




  const stateCityMap = {
    AndhraPradesh: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
    ArunachalPradesh: ["Itanagar", "Pasighat", "Naharlagun", "Tawang"],
    Assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat"],
    Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
    Chhattisgarh: ["Raipur", "Bilaspur", "Korba", "Durg"],
    Goa: ["Panaji", "Margao", "Mapusa", "Vasco da Gama"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    Haryana: ["Chandigarh", "Faridabad", "Gurgaon", "Panipat"],
    HimachalPradesh: ["Shimla", "Dharamshala", "Manali", "Solan"],
    Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
    Karnataka: ["Bengaluru", "Mysore", "Mangalore", "Hubli"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
    MadhyaPradesh: ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Manipur: ["Imphal", "Thoubal", "Churachandpur", "Bishnupur"],
    Meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin"],
    Mizoram: ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
    Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
    Punjab: ["Chandigarh", "Amritsar", "Ludhiana", "Patiala"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
    Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Rangpo"],
    TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
    Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
    UttarPradesh: ["Lucknow", "Kanpur", "Varanasi", "Agra"],
    Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Almora"],
    WestBengal: ["Kolkata", "Darjeeling", "Asansol", "Siliguri"],
    AndamanAndNicobar: ["Port Blair", "Diglipur", "Havelock", "Rangat"],
    Chandigarh: ["Chandigarh"],
    DadraAndNagarHaveliAndDamanAndDiu: ["Daman", "Silvassa", "Diu"],
    Delhi: ["New Delhi"],
    JammuAndKashmir: ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    Ladakh: ["Leh", "Kargil"],
    Lakshadweep: ["Kavaratti", "Agatti", "Minicoy"],
    Puducherry: ["Pondicherry", "Karaikal", "Mahe", "Yanam"],
  };

  // console.log(sumAssured, finalPremium, selectedDuration, preExisting, preExistingAmount)

  const allCities = Object.values(stateCityMap).flat(); // Combine all cities across states.

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);

    if (state === "All") {
      // Show all cities if "All" is selected.
      setCities(allCities);
    } else {
      // Show cities for the specific selected state.
      setCities(stateCityMap[state] || []);
    }
  };



  const handlePincodeChange = (e) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) {
      setError("Only Numerical Values are allowed.");
    } else if (value.length !== 6) {
      setError("Please Enter a Valid 6-digit Pincode.");
    } else {
      setError("");
    }
    setPincode(value);
  };

  const[review,setReview]=useState([]);

  useEffect(()=>{
    const data1 = sessionStorage.getItem('typeOfReview')
    if(data1 == '')
    {
      setReview('')
    }
    else{
      setReview(data1);
    }

  },[])


  const handleEditClick = () => {

    sessionStorage.setItem('typeOfReview',review);
    console.log(sessionStorage.getItem('typeOfReview'));
    navigate('/nav')
  };
  // const premiumAmount = getPremiumForDuration(sumAssured, selectedDuration);

  const username = costumerdetails.fullName
    ? costumerdetails.fullName.charAt(0).toUpperCase() + costumerdetails.fullName.slice(1) : '';





  const handleClick = () => {

    const name = "xyz";
    const mobileno = "999999999";
    const address = "Ameerpet";
    const email = "y.pragathireddy@gmail.com";
    const amount = "50000";


    const var4 = 'https://api.razorpay.com/v1/payments/qr_codes/qr_FuZIYx6rMbP6gs';
    const options = {
      key: 'rzp_test_Su4WV4zdBIGTmZ',
      entity: var4,
      amount: Math.round(amount),
      name: 'Ramana Soft Insurance Company',
      description: 'IS A INSURANCE COMPANY',
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.linkedin.com%2Fcompany%2Framanasoftware&psig=AOvVaw2Zh4utBjRXA2B2qS0Do74T&ust=1738045954670000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNDotO-jlYsDFQAAAAAdAAAAABAE",
      handler: function (response) {
        alert(response.razorpay_payment_id);



      },

      prefill: {
        name: name,
        email: email,
        contact: mobileno,
      },
      notes: {
        address: address,
      },
      theme: {
        color: '#F37254',
      },
    }
    var pay = new window.Razorpay(options);
    pay.open();
    sessionStorage.clear();
    // navigate("/payment");
  }



  return (
   
    <div>
      <Nav />
      <div className="container mt-4">
        <div className="row">
          {/* Left Section with reduced width */}
          <div className="col-md-5">
            {/* Insurance Details Card */}
            <div className="card mb-3">
              <div className="card-body">
                <h2 className="card-title">Insurance Details</h2>
                <p>
                  <strong>Insurance Type:</strong> {data.length === 1 ? "Individual" : "Family"}
                </p>
                <div>
                  <p><strong>Policy Holder: {username}</strong></p>
                  <h3>Insured Members</h3>
                  {Array.isArray(data) && data.map((member, index) => (
                    <div key={index} className="mb-2">
                      <div><strong>Member Name:</strong> {member.RelationPersonName || "Unknown Member"}</div>
                      <div><strong>Member Age:</strong> {member.Age || "Unknown Member Age"}</div>
                    </div>
                  ))}
                </div>
                <Button variant="contained" className="mt-2" onClick={handleEditClick}>
                  Edit
                </Button>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="card mb-3">
              <div className="card-body">
                <h2 className="card-title">Payment Details</h2>
                <p><strong>Sum Assured:</strong> ₹{sumAssured ? sumAssured.toLocaleString() : "0"}</p>
                <p><strong>Premium Amount:</strong> ₹{finalPremium ? finalPremium.toLocaleString() : "0"}</p>
                <p><strong>Start Date:</strong> {startDate}</p>
                <p><strong>Renewal Date:</strong> {renewalDate}</p>
              </div>
            </div>
          </div>

          {/* Right Section with increased width */}
          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Contact Information</h2>

                {/* House No */}
                <div className="mb-2">
                  <label htmlFor="houseNo" className="form-label">House No:</label>
                  <input type="text" id="houseNo" className="form-control" placeholder="Enter House No" required />
                </div>

                {/* Street */}
                <div className="mb-2">
                  <label htmlFor="street" className="form-label">Street:</label>
                  <input type="text" id="street" className="form-control" placeholder="Enter Street" required />
                </div>

                {/* State */}
                <div className="mb-2">
                  <label htmlFor="state" className="form-label">State:</label>
                  <select id="state" className="form-select" value={selectedState} onChange={handleStateChange} required>
                    <option value="">Select State</option>
                    <option value="All">All States</option>
                    {Object.keys(stateCityMap).map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="mb-2">
                  <label htmlFor="city" className="form-label">City:</label>
                  <select id="city" className="form-select" required disabled={!selectedState}>
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Pincode */}
                <div className="mb-2">
                  <label htmlFor="pincode" className="form-label">Pincode:</label>
                  <input
                    id="pincode"
                    type="text"
                    className="form-control"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={handlePincodeChange}
                    required
                  />
                  {error && <p className="text-danger text-sm mt-1">{error}</p>}
                </div>
                <div className="text-center mt-1" >
                  <Button variant='contained' onClick={handleClick}>Make Payment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <Footer />
    </div>








  );
}

export default Review;


