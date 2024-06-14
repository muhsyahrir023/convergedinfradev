import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

function AddProblems() {
 const [request, setRequest] = useState("");
 const [temporary, setTemporary] = useState("");
 const [permanent, setPermanent] = useState("");
 const [status, setStatus] = useState("pending");
 const [date, setDate] = useState("");
 const navigate = useNavigate();

 const SaveSubmit = async (e) => {
  e.preventDefault();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Data Saved Successfully",
    showConfirmButton: false,
    timer: 2000
  });
  try {
    await axios.post('https://api-convergedinfrav2.vercel.app/add-problem', {
      request,
      temporary,
      permanent,
      status,
      date
    });
    navigate("/views");
  } catch (error) {
    console.log(error);
  }
 }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <div className="row">
          <div className="col-md-10 mt-4">
            <div className="card">
              <div className="card-body">
                <form onSubmit={SaveSubmit}>
                  <div className="form-group mb-3">
                    <label className="font-size-xs" style={{ fontSize: "medium" }}>Problem/Request</label>
                    <input type="text" name="request" value={request} onChange={(e)=> setRequest(e.target.value)} placeholder="Request" className="form-control mt-1" required />
                  </div>
                  <div className="form-group mb-3">
                    <label className="font-size-xs" style={{ fontSize: "medium" }}>No Ticket</label>
                    <input type="text" name="temporary" value={temporary} onChange={(e)=> setTemporary(e.target.value)} placeholder="Ticket" className="form-control mt-1" />
                  </div>
                  <div className="form-group mb-3">
                    <label className="font-size-xs" style={{ fontSize: "medium" }}>Solution</label>
                    <input type="text" name="permanent" value={permanent} onChange={(e)=> setPermanent(e.target.value)} placeholder="Solution" className="form-control mt-1" required />
                  </div>
                  <div className="form-group mb-3">
                    <label className="font-size-xs" style={{ fontSize: "medium" }}>Status</label>
                    <select name="status" value={status} onChange={(e)=> setStatus(e.target.value)} className="form-control mt-1" >
                      <option value="pending">Pending</option>
                      <option value="progress">Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label className="font-size-xs" style={{ fontSize: "medium" }}>Date</label>
                    <input type="date" name="date" value={date} onChange={(e)=> setDate(e.target.value)} className="form-control mt-1" required />
                  </div>
                  <div className="form-group mb-3">
                    <button type="submit" className="btn btn-primary" style={{ background: "linear-gradient(to right, #4facfe, #00f2fe)", float: "right" }}>Save Problem</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </DashboardLayout>
  );
}

export default AddProblems;
