import React, { useEffect, useContext, useState } from 'react'
import man from "../Components/img/testimonial-2.jpg"
import { Link, useNavigate, useLocation  } from 'react-router-dom'
import Header from '../Components/Header'
import Sidebar from '../Components/Sidebar'
import { StudentContext } from '../context/StudentState';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import CreateIcon from '@mui/icons-material/Create';
import EmailIcon from '@mui/icons-material/Email';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Swal from 'sweetalert2'

// import Home from '../Components/Home'
// import Header from '../Components/Header'

export default function RegisterStudent(props) {

  const location = useLocation();
  const navigate = useNavigate();
  const { registerStudent } = location.state;
  console.log("all student =",registerStudent)
  const [timeValue,setTimeValue] = useState()
  const [filterRegisterStudent, setFilterRegisterStudent] = useState(registerStudent)
  const [RegisterStudent, setRegisterStudent] = useState(registerStudent)
  

  let ContextValue = useContext(StudentContext);
  document.title = "StudentDashboard - All Student"
  const navigation = useNavigate()
  const [trainer, setTrainer] = useState()
  const [status, setStatus] = useState("")
  const [counselor, setCounselor]  = useState()
  const [rangeDate, setRangeDate]=  useState({
    startDate:"",
    endDate:""
  })
  const [detail, setDetail] = useState({

    month: null,
    trainer: null,
    trainerName:null,
    counselor: null,
    counselorName: null
    
  })

  const filterStudent = (registerData) => {
    
    console.log('register student',detail)
 
    let filterRegister = registerData.filter((data, index) => {
  
      return (detail.trainer!= null ? data.TrainerId == detail.trainer : true) && (detail.counselor != null ? data.CounselorId == detail.counselor : true) && (status!=="" ? data.status == status : true)
  
    })
    console.log('filter register student =',filterRegister)
    setFilterRegisterStudent(filterRegister)
    
  }

 
  useEffect(() => {
    getCounselor()
    getAllTrainer()
    filterStudent(registerStudent)
  }, [])

  

  const getCounselor = async()=>{
    const counsellor = await ContextValue.getAllCounselor()
    setCounselor(counsellor.counselorData)
    console.log('counselor all =',counsellor.counselorData)
  }

  const getAllTrainer = async () => {
    let allTrainer = await ContextValue.getAllTrainer() 
 
     setTrainer(allTrainer)
   }

 

  const SearchDemo = async()=>{  
  
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    let selectRegister = await fetch("https://uncodeblog.com/getRangeRegisteredStudent",{
      method:"GET",
      headers:{
        "startDate":rangeDate.startDate,
        "endDate":rangeDate.endDate
      }
    })

    ContextValue.updateProgress(60)
    selectRegister = await selectRegister.json()
    ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)
  
    
    console.log('select register =',selectRegister)
    setRegisterStudent(selectRegister)
    setFilterRegisterStudent(selectRegister)
    filterStudent(selectRegister)
   }

   let counselorData =[]

   const setCounselorData = (e)=>{
     console.log('select index =',e.target.selectedIndex,counselorData[e.target.selectedIndex])
     setDetail({...detail,["counselor"]:counselor[(e.target.selectedIndex-1)].counselorNo,["counselorName"]:e.target.value})
   }
   let trainerData =[]
 
   const setTrainerData = (e)=>{
     console.log('select index =',e.target.selectedIndex,counselorData[e.target.selectedIndex])
     setDetail({...detail,["trainer"]:trainer[(e.target.selectedIndex-1)].code,["trainerName"]:e.target.value})
   }

  

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const setStartEndate = (timeValue) => {
    let today = new Date();
    let startDate, endDate;
  
    if (timeValue === "Today") {
      startDate = today;
      endDate = today;
    } else if (timeValue === "Yesterday") {
      today.setDate(today.getDate() - 1); // Subtract 1 day to get yesterday
      startDate = today;
      endDate = today;
    } else if (timeValue === "Last Week") {
      endDate = new Date(); // Current date
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7); // Subtract 7 days to get a week ago
    } else {
      // Handle the case when time is not recognized
      console.error("Invalid time option");
      return;
    }
  
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    setRangeDate({...rangeDate, ["startDate"]:startDateStr, ["endDate"]:endDateStr})
    console.log("start date and end date =",startDateStr, endDateStr)
  
    return { startDate: startDateStr, endDate: endDateStr };
  };

  const fetchQueryData = (Query)=>{
    let filterRegisterData = registerStudent.filter((data) => {
      return (
        data.Name.toLowerCase().includes(Query.toLowerCase()) ||
        data.RegistrationNo.toLowerCase().includes(Query.toLowerCase())||
        data.Counselor.toLowerCase().includes(Query.toLowerCase())
      );
    });

    setFilterRegisterStudent(filterRegisterData)
  }

  const setToTime =(toTime)=>{
    const endDateStr = formatDate(new Date(toTime))
    setRangeDate({...rangeDate, ["endDate"]:endDateStr})
    console.log("to time ",endDateStr)
   }

   const setFromTime =(fromTime)=>{
    const startDateStr =  formatDate(new Date(fromTime))
    setRangeDate({...rangeDate, ["startDate"]:startDateStr})
    console.log("from time ",startDateStr)
    
   }

   const registerStatus = {
    Process: "warning",
    Added: "success",
    BackOut: "dark" 
  }

  const filterRegister = (value)=>{

    setStatus(value)

    let filterData = registerStudent.filter(data=>{

      return data.status===value

    })

    setFilterRegisterStudent(filterData)



  }

  const moveToAddRegisteredStudent = (data)=> {
    navigate('Add-Registered-Student',{ state: { data } })
  }

  return (

    <>

      <Header />
      <div className='sidebar-main-container'>
       
        <div className="content-body register-content-body">
          {/* row */}
          <div className="container-fluid">
            {/* <div className="row page-titles mx-0 j-c-space-between">
              <div className="col-sm-6 p-md-0">
              <div className="d-flex j-c-initial c-gap-40">
                  <select
                        id="exampleInputPassword1"
                        type="select"
                        name="Course"
                        class="custom-select mr-sm-2"
                        onChange={e =>{ setTimeValue(e.target.value);setStartEndate(e.target.value)}}
                    >
                        <option disabled selected>--select Time--</option>
                    
                                <option value="Today">Today</option>
                                <option value="Yesterday">Yesterday</option>
                                <option value="Last Week">Last Week</option>
                                <option value="Select Range">Select Range</option>
                        
                        
                    </select>

                     {timeValue==="Select Range" && 
                     <>
                     <label>From</label>
                      <input type="date" class="custom-select mr-sm-2" onChange={e=>setFromTime(e.target.value)}></input>
                      <label>To</label>
                      <input type="date" class="custom-select mr-sm-2" onChange={e=>setToTime(e.target.value)}></input>
                      </>}

          <button className='filter-btn' onClick={SearchDemo}>Search</button>
          </div>


                    <div className='message-form'>
          
            
          <div className="preference-thumb thumb">
            <label className="form-label">Counselor :</label>
            {counselor && <select className="custom-select mr-sm-2" required name='counselor' onChange={(e) => setCounselorData(e)}>
              <option selected>Choose Counselor...</option>
              {counselor.map((data,index) => {
               
                return (
                  <option value={data.Name}>{data.Name}</option>
                )
              })}
            </select>
            }
          </div>
          <div className="preference-thumb thumb">
            <label className="form-label">Trainer :</label>
            {trainer && <select className="custom-select mr-sm-2" required name='trainer' onChange={(e) => setTrainerData(e)}>
              <option selected>Choose Trainer...</option>
              {trainer.map((data,index) => {
                
                return (
                  <option value={data.Name}>{data.Name}</option>
                )
              })}
            </select>
            }
          </div>
          <button className='filter-btn' onClick={e=>filterStudent(RegisterStudent)}>Filter</button>
        </div>
        
        <div className="preference-thumb thumb">
            {trainer && <select className="custom-select mr-sm-2" required name='trainer' onChange={e=>filterRegister(e.target.value)}>
              <option selected disabled>-- Status --</option>
              <option value="Added">Added</option>
              <option value="Process">Process</option>
              <option value="BackOut">Back Out</option>
             
            </select>
            }
          </div>

              </div>

                 
              <div className="d-flex flex-d-cloumn">

<div className='f-bold f-25'>Total Register : {filterRegisterStudent.length}</div>
<div className='f-bold f-25'>Date : {rangeDate.startDate} - {rangeDate.endDate}</div>
<div className='f-bold f-25'>Counselor : {detail.counselorName}</div>
<div className='f-bold f-25'>Trainer :  {detail.trainerName}</div>

</div>
              
            </div> */}
            <div className="row">
              <div className="col-lg-12">

              </div>
              <div className="col-lg-12">
                <div className="row tab-content">
                  <div id="list-view" className="tab-pane fade active show col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">Register Students List</h4>

                      </div>

                      <div class="d-flex mb-20" role="search">
                      <input
                        class="form-control me-2"
                        type="search"
                        placeholder="Search By Name or Enrollment No. or Counsellor Name"
                        aria-label="Search"
                        name="search"
                        onChange={(e) => fetchQueryData(e.target.value)}
                      />
                      {/* <button class="btn btn-outline-dark" type="submit" onClick={fetchQueryData}>Search</button> */}
                    </div>




                      <div class="">


                        <div class="row">

                          <div class="col-md-12">


                          <div class="table-responsive recentOrderTable __web-inspector-hide-shortcut__">
                            <table id="datatable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                              <thead>
                                <tr>
                                 
                                  <th>Enrollment No.</th>
                                  <th>Name</th>
                                  <th>Contact</th>
                                  <th>Counselor</th>
                                
                                  <th>Registration Date</th>
                                  <th>course</th>
                                  <th>Parent Name</th>
                                  <th>Parent Number</th>
                                  <th>Action</th>
                                  <th>PDF</th>
                                 

                                </tr>
                              </thead>



                              <tbody>
                                {filterRegisterStudent && filterRegisterStudent.map((data, index) => {

                                  return (
                                    <tr>

                                      <td>{data.RegistrationNo}</td>
                                      <td>{data.Name}</td>
                                      <td>{data.Number}</td>
                                      <td>{data.Counselor}</td>
                                      <td>{data.RegistrationDate}</td>
                                      <td>{data.Course}</td>
                                      <td>{data.Pname}</td>
                                      <td>{data.Pnumber}</td>
                                      
                                     <td> <button className="btn btn-primary" disabled={data.status==="Added"?true:false} onClick={e=>moveToAddRegisteredStudent(data)}><CreateIcon /></button></td>
                                      
                                     <td><TextSnippetIcon class="pdf-icon" onClick={e=> {navigate("/Add-Registered-Student/registrationReceipt", {
        state: { data: data },
      })}}/></td>
                                      
                                    </tr>
                                  )
                                })
                                }

                              </tbody>
                            </table>
                            </div>


                          </div>
                        </div>
                      </div>










                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>






  )
}
