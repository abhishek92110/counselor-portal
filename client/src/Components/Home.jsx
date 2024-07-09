import React, { useState, useEffect, useContext } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MessageIcon from "@mui/icons-material/Message";
import { NavLink, useNavigate } from "react-router-dom";
import { adddata, deldata, updatedata } from "../context/ContextProvider";
import Swal from "sweetalert2";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { StudentContext } from "../context/StudentState";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Link, useParams } from "react-router-dom";

export default function Home() {
  let ContextValue = useContext(StudentContext);

  document.title = "StudentDashboard - Admin panel";

  const navigation = useNavigate();
  const navigate = useNavigate();

  let sameDateTime = [];
  let studentData = [];

  const [allStudent, setAllStudent] = useState();
  const { dltdata, setDLTdata } = useContext(deldata);
  const { udata, setUdata } = useContext(adddata);
  const { updata, setUPdata } = useContext(updatedata);
  const [totalStudent, setTotalStudent] = useState();
  const [newStudent, setNewStudent] = useState();
  const [pastSevenStudent, setPastSevenStudent] = useState();
  const [processBar, setProcessBar] = useState();
  // const [searchQuery, setSearchQuery] = useState();
  const [allStudentData, setAllStudentData] = useState();
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(20);
  const [totalItem, setTotalItem] = useState();
  const [currentTrainer, setCurrentTrainer] = useState();
  const [user, setUser] = useState("student");
  const [currentStudent, setCurrentStudent] = useState();
  const [counselor, setCounselor] = useState();
  const [total, setTotal] = useState();
  const [newTotal, setNewTotal] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [totalrunningBatch, setTotalRunningBatch] = useState();
  const [register, setRegister] = useState();
  const [currentRegister, setCurrentRegister] = useState();
  const [allDemo, setAllDemo] = useState();
  const [newDemo, setNewDemo] = useState();
  const [demoList, setDemoList] = useState();
  const [demoStudentData, setDemoStudentData] = useState();
  const [allDemoList, setAllDemoList] = useState();
  const [newDemoStudentData, setNewDemoStudentData] = useState();
  const [newDemoList, setNewDemoList] = useState();
  const [upcomingDemoList, setUpcomingDemoList] = useState();
  const [upcomingDemoStudent, setUpcomingDemoStudent] = useState();
  const [allCourse, setAllCourse] = useState();
  const [allCourseLength, setAllCourseLength] = useState();
  const [course, setCourse] = useState();
  const [weekDaysBatch, setWeekDaysbatch] = useState();
  const [weekEndBatch, setWeekEndBatch] = useState();
  const [currentMonth, setCurrentMonth] = useState('');
  const [dataStatus, setDataStatus] = useState("month")

  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]


  //All Trainer
  let tempCurrentStudent;
  const [getuserdata, setUserdata] = useState("");
  console.log("trainer");
  const getTrainerdata = async () => {
    const res = await fetch("https://uncodeblog.com/trainer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("trainer data =", data);
    if (res.status === 422 || !data) {
      console.log("error ");
    } else {
      setUserdata(data);
      setCurrentTrainer(data);
      localStorage.setItem("allTrainer", JSON.stringify(data));
    }
  };

  const getAllCourses = async () => {
    console.log("all course function");
    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);

    let allCourse = await ContextValue.getAllMainSubCourse();

    console.log("all course =", allCourse);
    setAllCourse(allCourse.allCourse);
    setAllCourseLength(allCourse.courses.length);
    setCourse(allCourse.courses);
    ContextValue.updateProgress(100);
    ContextValue.updateBarStatus(false);
  };

  // async function fetchAdminStatus() {
  //   ContextValue.updateProgress(30);
  //   ContextValue.updateBarStatus(true);
  //   try {
  //     const status = await ContextValue.checkAdmin();

  //     console.log("status of admin =", status);
  //     if (status.status === "active") {
  //       getdata();
  //       getTrainerdata();
  //       getCounselorData();
  //       getTotalStudent();
  //       getNewStudent();
  //       getTotalFees();
  //       getRunningBatch();
  //       getRegisteredStudent();
  //       getAllDemo();
  //       getNewDemo();
  //       getAllBatches();
  //       getUpcomingDemo();
       
  //     } else {
  //       navigation("/");
  //       // alert("you are not authorized");
  //       ContextValue.updateProgress(100);
  //       ContextValue.updateBarStatus(false);
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Something went Wrong Try Again",
  //     });
  //     ContextValue.updateProgress(100);
  //     ContextValue.updateBarStatus(false);
  //     console.error("Error fetching admin status:", error);
  //   }
  // }

  useEffect(() => {
    // fetchAdminStatus();



    setCurrentMonthFunc()
    // getRegisteredStudent();
    
    getAllCourses();
   
  }, []);

  const setCurrentMonthFunc = ()=>{
    
    const now = new Date();
    // Get the current month and year
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    // Set the value to the current month and year
    setCurrentMonth(`${year}-${month}`);
    getRegisteredStudentMonth(month)
  }

  const getRegisteredStudent = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let registeredStudent = await ContextValue.getRegisterStudent()
    setRegister(registeredStudent)
    setCurrentRegister(registeredStudent)

    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }
  // get month wise data


  const getRegisteredStudentMonth = async(month)=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let registeredStudent = await ContextValue.getRegisterStudentMonth(month)
    console.log("month wise student data =",registeredStudent)
    setRegister(registeredStudent)
    setCurrentRegister(registeredStudent)

    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }
 

  const showMessagedialog = async (id) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });

    if (text) {
      Swal.fire(text);
    }

    let checkId = [{ id }];

    let sendData = await fetch("https://uncodeblog.com/sendmessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, checkid: checkId, from: "admin" }),
    });

    let fetchData = await sendData.json();
  };



  //sweetalert

  //Delete student


 
 
  //search
  const fetchQueryData = (Query) => {
    if (user === "student") {
      let filterQueryData = allStudentData.filter((data) => {
        return (
          data.Name.toLowerCase().includes(Query.toLowerCase()) ||
          data.EnrollmentNo.toLowerCase().includes(Query.toLowerCase())
        );
      });
      setCurrentStudent(filterQueryData);
    }
    if (user === "register") {
      let filterRegisterData = register.filter((data) => {
        return (
          data.Name.toLowerCase().includes(Query.toLowerCase()) ||
          data.RegistrationNo.toLowerCase().includes(Query.toLowerCase())
        );
      });

      setCurrentRegister(filterRegisterData);
    }

    if (user === "trainer") {
      let filterTrainerData = getuserdata.filter((data) => {
        return (
          data.Name.toLowerCase().includes(Query.toLowerCase()) ||
          data.code.toLowerCase().includes(Query.toLowerCase())
        );
      });
      setCurrentTrainer(filterTrainerData);
    }
    if (user === "counselor") {
      let filterCounselorData = counselor.filter((data) => {
        return (
          data.Name.toLowerCase().includes(Query.toLowerCase()) ||
          data.counselorNo.toLowerCase().includes(Query.toLowerCase())
        );
      });
      setCounselor(filterCounselorData);
    }
  };

  const badgeStatus = {
    pending: "warning",
    backout: "dark",
    deactive: "danger",
    active: "success",
  };
  const registerStatus = {
    Process: "warning",
    Added: "success",
    BackOut: "dark",
  };

  const moveToEditTrainer = (trainer) => {
    navigate("/EditTrainer", { state: { trainer } });
  };
  const moveToEditCounselor = (counselor) => {
    navigate("/EditCounselor", { state: { counselor } });
  };
  const moveToCounselor = (counselor) => {
    navigate("/AboutCounselor", { state: { counselor } });
  };

  const moveToViewFee = () => {
    navigate("ViewFee", { state: { fee: totalAmount } });
  };

  const moveToAddRegisteredStudent = (data) => {
    navigate("Add-Registered-Student", { state: { data } });
  };

  const moveToRegisterStudent = () => {
    navigate("Registered-Student", { state: { registerStudent: register } });
  };
  const moveToAddStudent = () => {
    navigate("Add-Registered-Student");
  };

 

 
  const moveToAllDemo = () => {
    navigate("All-Demo", {
      state: { demoList: allDemoList, demoStudentData, status: "demo" },
    });
  };
  const moveToNewDemo = () => {
    navigate("New-Demo", {
      state: { demoList: newDemoList, demoStudentData: newDemoStudentData },
    });
  };

  const moveToUpcomingDemo = () => {
    navigate("upcomingDemo", {
      state: { demo: upcomingDemoList, demoStudent: upcomingDemoStudent },
    });
  };

  const moveToAllCourses = () => {
    navigate("AllCourse", { state: { course: course, allCourse: allCourse } });
  };
  const moveToAddCourses = () => {
    navigate("AddCounselor");
  };
  const moveToAllBatchTiming = () => {
    navigate("AllBatchTiming", {
      state: { weekDays: weekDaysBatch, weekEnd: weekEndBatch },
    });
  };

  const moveToStudentAttendance = (batch, id) => {
    navigate("fullattendance", { state: { id: id, batch: batch } });
  };

  const setMonthFunc =(value)=>{

    setCurrentMonth(value)
    const month = value.split('-')[1]
    console.log("selected month value =",value,month)
    getRegisteredStudentMonth(month)

  }

  function processMonth(monthString) {
    // Remove leading zero and convert to number
    let monthNumber = parseInt(monthString, 10);
  
    // Decrement the value by one
    monthNumber -= 1;
  
    // Return the result as a string

    console.log("month string =",monthNumber.toString())
    return monthNumber.toString();

  }
  return (
    <>
      <Header />
      <div className="sidebar-main-container">
        {/* <Sidebar /> */}
        <div className="content-body">

<div className="d-flex flex-col align-items-center">

          <div>
            
           {/* <input type="month"/> */}

          <button className={`btn btn-primary mx-2 ${dataStatus==="month"?"":"btn-fade"}`} onClick={()=>{setDataStatus("month"); setCurrentMonthFunc()}}> Current Month</button>
      {dataStatus==="month" && <input type="month" id="monthInput" value={currentMonth} onChange={(e) => {setMonthFunc(e.target.value)}} />}

      <button className={`btn btn-primary mx-2 ${dataStatus==="all"?"":"btn-fade"}`} onClick={()=>{setDataStatus("all");getRegisteredStudent()}}> All Student</button>

          </div>
     {dataStatus==="month" && <h4 className="my-2">{monthName[processMonth(currentMonth.split('-')[1])]} Student</h4>}
     {dataStatus==="all" && <h4 className="my-2">All Student</h4>}
      </div>
          {/* row */}
          <div className="container-fluid">
            <div className="row total-detail-container">
              <div className="detail-card"> 

                <div className="col-xl-3 col-xxl-3 col-sm-6">
                  <div className="widget-stat card p-0 bg-secondary">
                    <div className="card-body" onClick={moveToAddStudent}>
                      <div className="media">
                        <span className="mr-3">
                        <i class="fa-solid fa-plus"/>
                        </span>
                        <div
                          className="media-body text-white"
                          
                        >
                          <p className="mb-1">Add Registration</p>
                          {/* <div className="progress mb-2 bg-white">
                        <div
                          className="progress-bar progress-animated bg-light"
                          style={{ width: "76%" }}
                        />
                      </div> */}
                          {/* <small>76% Increase in 20 Days</small> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  

                <div className="col-xl-3 col-xxl-3 col-sm-6">
              <div className="widget-stat card p-0 bg-secondary">
                <div className="card-body" onClick={moveToRegisterStudent}>
                  <div className="media">
                    <span className="mr-3">
                    <i class="fa-regular fa-address-card"/>
                    </span>
                    <div className="media-body text-white" >
                      <p className="mb-1">Total Registration</p>
                      <h3 className="text-white">{register && register.length}</h3>
                      {/* <div className="progress mb-2 bg-white">
                        <div
                          className="progress-bar progress-animated bg-light"
                          style={{ width: "76%" }}
                        />
                      </div> */}
                      {/* <small>76% Increase in 20 Days</small> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>  

            <div className="col-xl-3 col-xxl-3 col-sm-6">
                  <div className="widget-stat card p-0 bg-danger">
                    <div className="card-body">
                      <div className="media">
                        <span className="mr-3">
                          <i class="fa-regular fa-newspaper" />
                        </span>
                        <div
                          className="media-body text-white"
                          onClick={moveToAllCourses}
                        >
                          <p className="mb-1">All Course</p>
                          <h3 className="text-white">
                            {allCourseLength && allCourseLength}
                          </h3>
                          {/* <div className="progress mb-2 bg-white">
                        <div
                          className="progress-bar progress-animated bg-light"
                          style={{ width: "30%" }}
                        />
                      </div> */}
                          {/* <small>30% Increase in 30 Days</small> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
              
              
              </div>
            

              {/* <div className='right-left-arrow'>
            <i class="fa-solid fa-left-long" onClick={backItem}></i>
            <i class="fa-solid fa-right-long" onClick={moveItem}></i>
            </div> */}
            </div>
          </div>
        </div>
      </div>

      {/***********************************
      Content body end
*/}
    </>
  );
}
