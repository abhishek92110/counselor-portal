import React, { useState, useEffect, useContext } from "react";
import { StudentContext } from "../../context/StudentState";
import Cslidebar from "./Cslidebar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";

const RegisterStudentAdd = () => {
  let navigate = useNavigate();

  const [allcourse, setAllCourse] = useState();
  const [trainer, setTrainer] = useState();
  const [course, setCourse] = useState();
  const [methodStatus, setMethodStatus] = useState();
  const [allFieldStatus, setAllFieldStatus] = useState(false);
  const [counselor, setCounselor] = useState();
  // const location = useLocation();
  // const { counselor } = location.state;

  let ContextValue = useContext(StudentContext);

  useEffect(() => {
    getAllCourse();
    getTrainer();
    getCounselor();
  }, []);

  const getCounselor = async () => {
    const counsellor = await ContextValue.getAllCounselor();
    setCounselor(counsellor.counselorData);
    console.log("counselor all =", counsellor.counselorData);
  };

  // const getAllCourse = async () => {
  //   let allCourse = await ContextValue.getAllBatchCourse();
  //   console.log("course =", allCourse.batchCourse[0].Course);
  //   setAllCourse(allCourse.batchCourse[0].Course);
  // };

  const getAllCourse = async () => {
    let allCourse = await ContextValue.getAllMainSubCourse();
    console.log("course =", allCourse, allCourse.courses);
    setCourse(allCourse.allCourse);
    setAllCourse(allCourse.courses);
  };

  const [inpval, setINP] = useState({
    Name: "",
    Email: "",
    Number: "",
    Pname: "",
    Pnumber: "",
    RegistrationDate: "",
    Course: "",
    subCourse: "",
    Counselor: "",
    counselorNumber: "",
    CounselorId: "",
    RegistrationFees: "",
    paidFees: "",
    CourseFees: "",
    TrainerName: "",
    TrainerId: "",
    BatchMode: "",
    PaymentMode: "",
    Remark: "",
    EMI: "",
    totalInstallment: "",
    status: "Process",
    PaymentMethod: "",
    joinTime: "",
    joinDate: "",
    counselorReference: "",
    month: "",
    year: "",
    courseCode:""
  });

  function isAllFieldsFilled() {
    for (const key in inpval) {
      if (inpval.hasOwnProperty(key)) {
        if (!inpval[key]) {
          console.log("false field");
          return false; // Return false if any field is empty
        }
      }
    }
    console.log("true field");

    return true; // Return true if all fields are filled
  }

  const addinpdata = async (e) => {
    e.preventDefault();
    let tempInpVal = inpval;
    let dateArray = tempInpVal.RegistrationDate.split("-");
    console.log("regsitration array =", dateArray);
    tempInpVal.RegistrationDate = dateConvert(tempInpVal.RegistrationDate);
    tempInpVal.joinDate = dateConvert(tempInpVal.joinDate);
    tempInpVal.month = dateArray[1];
    tempInpVal.year = dateArray[0];
    tempInpVal.totalInstallment = `${tempInpVal.totalInstallment} Installment`

    if(tempInpVal.PaymentMethod==="OTP"){

      tempInpVal.totalInstallment="null"

    }

    console.log("register value =", tempInpVal);
    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);
    try {
      const res = await fetch("https://uncodeblog.com/registerStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempInpVal),
      });

      ContextValue.updateProgress(60);

      const data = await res.json();

      const googleSheetResponse = await fetch(
        "https://uncodeblog.com/google-sheet-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const googleSheetResponseData = await googleSheetResponse.json();
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      ContextValue.SuccessMsg();
      navigate("/Add-Registered-Student/registrationReceipt", {
        state: { data: data },
      });
      EmptyFilled();
      console.log("Data", data);
    } 
    catch (error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      console.log("error =", error.message);
    }
  };

// sending data to db and sending mail also

  const addinpdataMail = async (e) => {
    e.preventDefault();
    let tempInpVal = inpval;
    let dateArray = tempInpVal.RegistrationDate.split("-");
    console.log("regsitration array =", dateArray);
    tempInpVal.RegistrationDate = dateConvert(tempInpVal.RegistrationDate);
    tempInpVal.joinDate = dateConvert(tempInpVal.joinDate);
    tempInpVal.month = dateArray[1];
    tempInpVal.year = dateArray[0];
    tempInpVal.totalInstallment = `${tempInpVal.totalInstallment} Installment`

    if(tempInpVal.PaymentMethod==="OTP"){

      tempInpVal.totalInstallment="null"

    }

    console.log("register value =", tempInpVal);
    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);
    try {
      const res = await fetch("https://uncodeblog.com/registerStudentMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempInpVal),
      });

      ContextValue.updateProgress(60);

      const data = await res.json();

      const googleSheetResponse = await fetch(
        "https://uncodeblog.com/google-sheet-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const googleSheetResponseData = await googleSheetResponse.json();
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      ContextValue.SuccessMsg();
      navigate("/Add-Registered-Student/registrationReceipt", {
        state: { data: data },
      });
      EmptyFilled();
      console.log("Data", data);
    } catch (error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      console.log("error =", error.message);
    }
  };

  // function to convert date

  const dateConvert = (selectedDate) => {
    const originalDate = new Date(selectedDate);
    const formattedDate = originalDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return formattedDate;
  };

  const EmptyFilled = () => {
    let tempInpVal = inpval;

    for (let key in inpval) {
      tempInpVal[key] = "";
    }

    setINP(tempInpVal);
  };

  let trainerData = {};

  const getTrainer = async () => {
    const trainerData = await ContextValue.getAllTrainer();
    console.log("trainer data =", trainerData);
    setTrainer(trainerData);
  };

  const setTrainerData = (e) => {
    console.log(
      "trainer data =",
      e.target.selectedIndex,
      trainerData[e.target.selectedIndex],
      trainerData
    );
    setINP({
      ...inpval,
      [e.target.name]: e.target.value,
      ["TrainerId"]: trainer[e.target.selectedIndex - 1].code,
    });

    const status = isAllFieldsFilled();
    setAllFieldStatus(status);
  };

  const setMainCourse = (subCourse) => {
    let mainCourse;
    let courseCode;
    course.map((data) => {
      data.subCourse.map((element) => {
        if (element.course === subCourse) {
          mainCourse = data.mainCourse;
          courseCode = element.courseCode;
          console.log("element =",element)
        }
      });
    });

    console.log("sub and main Course =", subCourse, mainCourse,courseCode,course);
    setINP({ ...inpval, ["Course"]: mainCourse, ["subCourse"]: subCourse, ["courseCode"]:courseCode });

    const status = isAllFieldsFilled();
    setAllFieldStatus(status);
  };

  const setCounselorData = (e) => {
    console.log(
      "select index =",
      e.target.selectedIndex,
      counselor[e.target.selectedIndex - 1].counselorNo
    );
    setINP({
      ...inpval,
      ["CounselorId"]: counselor[e.target.selectedIndex - 1].counselorNo,
      ["counselorNumber"]: counselor[e.target.selectedIndex - 1].Number,
      ["Counselor"]: e.target.value,
      ["counselorReference"]:
        counselor[e.target.selectedIndex - 1].counselorReference,
    });
    const status = isAllFieldsFilled();
    setAllFieldStatus(status);
  };

  const setMethod = (value) => {
    setMethodStatus(value);
    if (value === "EMI") {
      setINP({ ...inpval, ["PaymentMode"]: value, ["PaymentMethod"]: value });
      const status = isAllFieldsFilled();
      setAllFieldStatus(status);
    }
  };

  return (
    <>
      <Header />
      <div className="sidebar-main-container">
        <HashLoader color="#3c84b1" />
        {/* <Cslidebar /> */}
        {/* <div className='pos-center'>
      <HashLoader color="#3c84b1" />
    </div> */}
        <div className="content-body">
          <div className="container-fluid">
            <div className="row page-titles mx-0">
              <div className="col-sm-6 p-md-0">
                <div className="welcome-text">
                  <h4>Resigster Student</h4>
                </div>
              </div>
              <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item active">
                    <a href="javascript:void(0);">Students</a>
                  </li>
                  <li className="breadcrumb-item active">
                    <a href="javascript:void(0);">Add Student</a>
                  </li>
                </ol>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 col-xxl-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Basic Info</h5>
                  </div>
                  <div>
                    <form action="#" method="post">
                      <div className="row">
                        
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              value={inpval.Name}
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="Name"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Number</label>
                            <input
                              type="text"
                              max="10"
                              value={inpval.Number}
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="Number"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              value={inpval.Email}
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="Email"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Parent Name</label>
                            <input
                              type="text"
                              value={inpval.Pname}
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="Pname"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Parent Number</label>
                            <input
                              type="text"
                              max="10"
                              value={inpval.Pnumber}
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="Pnumber"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">
                              Registration Date
                            </label>
                            <input
                              type="date"
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="RegistrationDate"
                              class="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Counsellor</label>
                            {counselor && (
                              <div>
                                <select
                                  className="counselor-section custom-select mr-sm-2"
                                  required
                                  name="counselor"
                                  onChange={(e) => setCounselorData(e)}
                                >
                                  <option selected>Choose Counselor...</option>
                                  {counselor.map((data, index) => {
                                    return (
                                      <option value={data.Name}>
                                        {data.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">
                              Registration Amount
                            </label>
                            <input
                              type="text"
                              max="10"
                              value={inpval.RegistrationFees}
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="RegistrationFees"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Course Fees</label>
                            <input
                              type="text"
                              max="10"
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="CourseFees"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Batch mode</label>
                            <select
                              id="exampleInputPassword1"
                              type="select"
                              name="BatchMode"
                              class="form-control"
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                            >
                              <option disabled selected>
                                --select Batch Mode--
                              </option>
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Payment Method</label>
                            <select
                              id="exampleInputPassword1"
                              type="select"
                              name="PaymentMethod"
                              class="form-control"
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                setMethod(e.target.value);
                                
                              }}
                            >
                              <option disabled selected>
                                --Payment Method--
                              </option>
                              <option value="EMI">EMI</option>
                              <option value="Installment">Installment</option>
                              {/* <option value="Installment">Installment</option> */}
                              {/* <option value="2 Installment">
                                2 Installment{" "}
                              </option>
                              <option value="3 Installment">
                                3 Installment{" "}
                              </option>
                              <option value="4 Installment">
                                4 Installment{" "}
                              </option>
                              <option value="5 Installment">
                                5 Installment{" "}
                              </option>
                              <option value="6 Installment">
                                6 Installment{" "}
                              </option> */}
                              <option value="OTP">One Time Payment</option>
                            </select>
                          </div>
                        </div>

                        {/* Total installment and EMI getter */}

                        {methodStatus === "EMI" && (
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label className="form-label">
                                Total EMI Month
                              </label>
                              <input
                                type="text"
                                onChange={(e) => {
                                  setINP({
                                    ...inpval,
                                    [e.target.name]: e.target.value,
                                  });
                                  const status = isAllFieldsFilled();
                                  setAllFieldStatus(status);
                                }}
                                name="totalInstallment"
                                class="form-control"
                                id="exampleInputPassword1"
                              />
                            </div>
                          </div>
                        )}
                        {methodStatus === "Installment" && (
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label className="form-label">
                                Total Installment
                              </label>
                              <select
                                id="exampleInputPassword1"
                                type="select"
                                name="totalInstallment"
                                class="form-control"
                                onChange={(e) => {
                                  setINP({
                                    ...inpval,
                                    [e.target.name]: e.target.value,
                                  });
                                  const status = isAllFieldsFilled();
                                  setAllFieldStatus(status);
                                }}
                              >
                                <option disabled selected>
                                  --Total Installment--
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {methodStatus === "OTP" && (
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label className="form-label">Full Payment</label>
                              <input
                                type="text"
                                onChange={(e) => {
                                  setINP({
                                    ...inpval,
                                    [e.target.name]: e.target.value,
                                  });
                                  const status = isAllFieldsFilled();
                                  setAllFieldStatus(status);
                                }}
                                name="paidFees"
                                class="form-control"
                                id="exampleInputPassword1"
                              />
                            </div>
                          </div>
                        )}

                        {/* {
                     methodStatus==="EMI" ?   
                     <>                 
                       <div className="col-lg-6 col-md-6 col-sm-12">
                       <div className="form-group">
                         <label className="form-label">Payment mode</label>
                         <input
                           id="exampleInputPassword1"
                           type="text"
                           name="PaymentMode"
                           class="form-control"
                           value = "By Bank"
                         />
                          
                       </div>
                        </div>
                     </>
                      : 
                      <>                                           
                       <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Payment mode</label>
                            <select
                              id="exampleInputPassword1"
                              type="select"
                              name="PaymentMode"
                              class="form-control"
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name] : e.target.value,
                                })
                              }
                            >
                              <option disabled selected>
                                --select Payment Mode--
                              </option>
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                            </select>
                          </div>
                        </div>
                        </>

                        } */}

                        {methodStatus === "EMI" ? (
                          <>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label className="form-label">
                                  Payment mode
                                </label>
                                <select
                                  id="exampleInputPassword1"
                                  type="select"
                                  name="PaymentMode"
                                  class="form-control"
                                  onChange={(e) => {
                                    setINP({
                                      ...inpval,
                                      [e.target.name]: e.target.value,
                                    });
                                  }}
                                >
                                  <option disabled selected>
                                    --select Payment Mode--
                                  </option>
                                  <option value="By Bank">By Bank</option>
                                  <option value="Credit Card">
                                    Credit Card
                                  </option>
                                </select>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="not-emi-section col-lg-6">
                              <div className="col-sm-12">
                                <div className="form-group">
                                  <label className="form-label">
                                    Payment mode
                                  </label>
                                  <select
                                    id="exampleInputPassword1"
                                    type="select"
                                    name="PaymentMode"
                                    class="form-control"
                                    onChange={(e) => {
                                      setINP({
                                        ...inpval,
                                        [e.target.name]: e.target.value,
                                      });
                                      const status = isAllFieldsFilled();
                                      setAllFieldStatus(status);
                                    }}
                                  >
                                    <option disabled selected>
                                      --select Payment Mode--
                                    </option>
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Portal">Portal</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Course Name</label>
                            {allcourse && (
                              <select
                                id="exampleInputPassword1"
                                type="select"
                                name="Course"
                                class="form-control"
                                onChange={(e) => setMainCourse(e.target.value)}
                              >
                                <option disabled selected>
                                  --select Course Name--
                                </option>
                                {allcourse.map((data) => {
                                  return <option value={data.course}>{data.course}</option>;
                                })}
                              </select>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            
                            <div className="date-time-section">
                              <div className="date-sec">
                              <label className="form-label">Batch Join</label>
                                <input
                                  type="date"
                                  onChange={(e) => {
                                    setINP({
                                      ...inpval,
                                      [e.target.name]: e.target.value,
                                    });
                                    const status = isAllFieldsFilled();
                                    setAllFieldStatus(status);
                                  }}
                                  name="joinDate"
                                  className="form-control"
                                ></input>
                              </div>
                              <div className="time-sec">
                                <label className="form-label">Batch Time</label>
                                <input
                                  type="time"
                                  onChange={(e) => {
                                    setINP({
                                      ...inpval,
                                      [e.target.name]: e.target.value,
                                    });
                                    const status = isAllFieldsFilled();
                                    setAllFieldStatus(status);
                                  }}
                                  name="joinTime"
                                  className="form-control"
                                ></input>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Remark</label>
                            <input
                              type="text"
                              onChange={(e) => {
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                });
                                
                              }}
                              name="Remark"
                              class="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <button
                            type="submit"
                            onClick={addinpdata}
                            className="btn btn-primary"
                            disabled={ContextValue.barStatus}
                            // disabled={allFieldStatus===false?true:false}
                          >
                            Submit
                          </button>
                          <button
                            type="submit"
                            onClick={addinpdataMail}
                            className="btn btn-primary"
                            disabled={ContextValue.barStatus===true?true:(inpval.Email.length>0?false:true)}
                            // disabled={allFieldStatus===false?true:false}
                          >
                            Submit and Send Email
                          </button>
                          <button type="submit" className="btn btn-light">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterStudentAdd;
