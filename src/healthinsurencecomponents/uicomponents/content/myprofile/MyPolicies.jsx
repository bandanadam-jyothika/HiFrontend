


import React, { useEffect, useState } from "react";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import { Button, Card, CardContent, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function MyPolicies() {
  const [policyData, setPolicyData] = useState([]); // Combined data for rendering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);  // To store the data for the modal
  const mobileNumber = Cookies.get("MobileNumber");

  const [relationData, SetrelationData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    if (mobileNumber) {
      setLoading(true);
      setError(null);

      axios
        .get(`http://183.82.106.55:9100/register/fetch/${mobileNumber}`)
        .then((res) => {
          const userDataCustomerId = res.data.customerId;
          setPolicyData(res.data);
          axios
            .get(
              `http://183.82.106.55:9100/relation/customer-details?customerId=${userDataCustomerId}`
            )
            .then((relationsRes) => {
              axios
                .get(
                  `http://183.82.106.55:9100/payment/customerid?customerId=${userDataCustomerId}`
                )
                .then((paymentRes) => {
                  SetrelationData(relationsRes.data);
                  setPaymentData(paymentRes.data);
                  setLoading(false);
                })
                .catch((paymentError) => {
                  setError("Error fetching payment details.");
                  setLoading(false);
                });
            })
            .catch((relationsError) => {
              setError("Error fetching relations.");
              setLoading(false);
            });
        })
        .catch((error) => {
          setError("Error fetching user data.");
          setLoading(false);
        });
    }
  }, [mobileNumber]);

  const handleDownloadInvoice = (policyId) => {
    console.log(`Download invoice for Policy ID: ${policyId}`);
  };

  const handleOpenModal = (data) => {
    console.log(data);
    setModalData(data); // Store the full relation data for the selected policy
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <Typography
          variant="h4"
          className="mb-4"
          style={{ fontWeight: "bold", textAlign: "center" }}
        >
          RamanaSoft - Purchased Policy Overview
        </Typography>
        {paymentData.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No policies found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {paymentData.map((payment, index) => {
              // Filter relationData to find the matching relation by paymentId
              const relatedData = relationData.filter(
                (relation) => relation.paymentId === payment.paymentId
              );

              return relatedData.length > 0 ? (
                <Card key={index} className="mb-3">
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <Typography variant="h6" style={{ fontWeight: "bold" }}>
                          RamanaSecure Health Insurance
                        </Typography>
                        <div
                          style={{
                            borderBottom: "1px solid lightgray",
                            paddingBottom: "4px",
                            marginBottom: "16px",
                          }}
                        >
                          <Typography variant="h6" style={{ fontWeight: "bold" }}>
                            CustomerID: {payment.customerId}
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">
                          Insurance Type: {payment.insuranceType || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Sum Assured: {payment.sumAssuredAmount || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Premium Amount: {payment.premiumAmount || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Policy Holders Details:
                          <Link
                            onClick={() => handleOpenModal(relatedData)} // Pass full relation data
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            Click Here
                          </Link>
                        </Typography>
                        <div className="field-spacing"></div>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">
                          Number of Years: {payment.year || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Start Date: {payment.startDate || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Renewal Date: {payment.endDate || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>

                        <a
                          className='btn btn-success'
                          href={`http://183.82.106.55:9100/invoice/create/${payment.paymentId}`}
                          download='invoice'
                          target='_blank'
                        >
                          <Button
                            color="white"
                            startIcon={<DownloadIcon />}
                          >
                            Invoice
                          </Button>
                        </a>

                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : null;
            })}
          </Grid>
        )}
      </div>

      {/* Modal to display insured members */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ backgroundColor: "#4CAF50", color: "white", textAlign: "center" }}>
          Insured Members
        </DialogTitle>
        <DialogContent>
          {modalData ? (
            <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
              <Typography variant="body1" style={{ marginBottom: "10px", marginTop: "10px" }}>
                <strong>Member Details:</strong>
                {modalData.map((member, idx) => (
                  <div key={idx} style={{ marginBottom: "16px" }}>
                    <Typography variant="body1"><strong>Relation Name:</strong> {member.relationName}</Typography>
                    <Typography variant="body1"><strong>Relation Person Name:</strong> {member.relationPersonName}</Typography>
                    <Typography variant="body1"><strong>Age of Relation:</strong> {member.ageOfTheRelation}</Typography>
                    <Typography variant="body1"><strong>Disease:</strong> {member.disease}</Typography>
                    {/* Add more details as needed */}
                  </div>
                ))}
              </Typography>
            </div>
          ) : (
            <Typography variant="body1" color="textSecondary">No data available.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" variant="outlined" style={{ margin: "0 10px" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </div>
  );
}

export default MyPolicies;


