import React, { useState, useEffect } from 'react';
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdCheckBox } from "react-icons/md";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from 'axios';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function ProblemTable() {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [dateSortMethod, setDateSortMethod] = useState('asc');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('https://api-cidev.vercel.app/views');
      setProblems(response.data.payload.datas);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exportToExcel = () => {
    return new Promise((resolve, reject) => {
      try {
        const selectedData = problems.filter(problem => selectedItems.includes(problem.id));
        const worksheet = XLSX.utils.json_to_sheet(selectedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'Rekap Corrective Maintenance Project CI DEV.xlsx');
        setShowDropdown(false);
        resolve(true);
      } catch (error) {
        console.error('Error:', error);
        reject(false);
      }
    });
  };

  const handleExportexcel = async () => {
    try {
      await exportToExcel();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Export Data Successfully",
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to export data",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const handleDeleteSelectedItems = async () => {
    try {
      await axios.delete('https://api-cidev.vercel.app/delete-problems', {
        data: {
          ids: selectedItems
        }
      });

      const updatedProblems = problems.filter(problem => !selectedItems.includes(problem.id));
      setProblems(updatedProblems);
      setSelectedItems([]);
      setShowDropdown(false);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data deleted successfully",
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      console.error('Error deleting data:', error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to delete data",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Please select data before delete!",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSelectedItems();
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleModalOpen = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please select data to edit!",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    const idToEdit = selectedItems[0];
    try {
      const response = await axios.get(`https://api-cidev.vercel.app/views/${idToEdit}`);
      setEditData({ ...response.data.payload.data, originalData: { ...response.data.payload.data } });
      setEditedValue(response.data.payload.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to fetch data for editing",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = async () => {
    try {
      await axios.put(`https://api-cidev.vercel.app/views/${editData.id}`, {
        request: editData.request || editData.originalData.request,
        temporary: editData.temporary || editData.originalData.temporary,
        permanent: editData.permanent || editData.originalData.permanent,
        status: editData.status || editData.originalData.status,
        date: editData.date || editData.originalData.date
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data updated successfully",
        showConfirmButton: false,
        timer: 2000
      });

      setShowModal(false);

      fetchProblems();
    } catch (error) {
      console.error('Error updating data:', error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to update data",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const handleDateSortChange = () => {
    setDateSortMethod(method => (method === 'asc' ? 'desc' : 'asc'));
  };

  const sortByDate = (data, method) => {
    // Tambahkan pengecekan untuk data null atau undefined
    if (!data) {
      return [];
    }
  
    // Ubah data menjadi array jika data bukan array
    const dataArray = Array.isArray(data) ? data : [data];
  
    // Salin array data agar tidak mengubah data asli
    const sortedData = [...dataArray];
  
    // Urutkan data berdasarkan tanggal
    sortedData.sort((a, b) => {
      // Ubah nilai tanggal menjadi objek Date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return method === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
    return sortedData;
  };
  
  

  const sortedProblems = sortByDate(problems, dateSortMethod);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProblems.filter((problem) =>
    Object.values(problem).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (value instanceof Date) {
        const problemDate = new Date(value);
        const searchDate = new Date(searchTerm);
        return problemDate.toDateString().toLowerCase() === searchDate.toDateString().toLowerCase();
      }
      return false;
    })
  ).slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectAll = () => {
    if (selectedItems.length === problems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(problems.map(item => item.id));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <div className="row">
          <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-body">
                <div className='columns is-centered'>
                  <div className='columns is-half'>
                    <div className='col-md-4'>
                      <div className="input-group mb-3">
                        <div className="dropdown mx-2" style={{ float: 'right' }}>
                          <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" onClick={() => setShowDropdown(!showDropdown)} aria-haspopup="true" aria-expanded={showDropdown ? "true" : "false"}>
                            Actions
                          </button>
                          <div className={`dropdown-menu${showDropdown ? " show" : ""}`} aria-labelledby="dropdownMenuButton">
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={handleModalOpen}
                            >
                              Edit
                            </a>
                            <a className="dropdown-item" href="#" onClick={handleDelete}>Delete</a>
                            <a className="dropdown-item" href="#" onClick={handleExportexcel}>Export Excel</a>
                            <a className="dropdown-item" href="https://docs.google.com/spreadsheets/d/1LijGsIDFafZ3XTqrtaCzhs3DCnpKxlNmmjhDmhMCTkA/edit#gid=251384382">Data Perangkat</a>
                            <a className="dropdown-item" href="https://docs.google.com/spreadsheets/d/17IrMqheSsgTxRhmbBN8fPPGsz23wKzqcqT_0BG4ek5w/edit#gid=468076244">Data LUN</a>
                            <a className="dropdown-item" href="https://docs.google.com/spreadsheets/d/1xjRShnQ7wdOV_L1FDA4pqJc4hYxddWbw7ZOKOedx9X8/edit#gid=1120620629">Data Create VM</a>
                          </div>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm border-left-0"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>

                    <div className='col-md-12'>
                      <div className="table-responsive">
                        <table className='table is-striped is-fullwidth' style={{ overflowX: 'auto' }}>
                          <thead>
                            <tr>
                              <th style={{ fontSize: "medium" }}>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedItems.length === currentItems.length}
                                    onChange={handleSelectAll}
                                  />
                                </div>
                              </th>
                              <th style={{ fontSize: "medium" }}>No</th>
                              <th style={{ fontSize: "medium" }}>Request</th>
                              <th style={{ fontSize: "medium" }}>No Ticket</th>
                              <th style={{ fontSize: "medium" }}>Solution</th>
                              <th style={{ fontSize: "medium" }}>Status</th>
                              <th style={{ fontSize: "medium", cursor: 'pointer' }} onClick={handleDateSortChange}>
                                Date {' '}
                                {dateSortMethod === 'asc' ? <FaArrowUp size={14} /> : <FaArrowDown size={14} />}
                              </th>

                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.map((problem, index) => (
                              <React.Fragment key={problem.id}>
                                <tr>
                                  <td>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedItems.includes(problem.id)}
                                        onChange={() => handleCheckboxChange(problem.id)}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ fontSize: "medium" }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                  <td style={{ fontSize: "medium" }}>{problem.request}</td>
                                  <td style={{ fontSize: "medium", backgroundColor: problem.status === 'Pending' ? 'orange' : problem.status === 'Progress' ? 'yellow' : problem.status === 'Completed' ? 'green' : 'inherit' }}>
                                    {problem.temporary}
                                  </td>
                                  <td style={{ fontSize: "medium", backgroundColor: problem.status === 'Pending' ? 'orange' : problem.status === 'Progress' ? 'yellow' : problem.status === 'Completed' ? 'green' : 'inherit' }}>
                                    {problem.permanent}
                                  </td>
                                  <td style={{ fontSize: "medium", backgroundColor: problem.status === 'Pending' ? 'orange' : problem.status === 'Progress' ? 'yellow' : problem.status === 'Completed' ? 'green' : 'inherit' }}>
                                    <span className={`badge ${problem.status === 'pending' ? 'bg-warning' : problem.status === 'progress' ? 'bg-primary' : problem.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>{problem.status}</span>
                                  </td>
                                  <td style={{ fontSize: "medium", backgroundColor: problem.status === 'Pending' ? 'orange' : problem.status === 'Progress' ? 'yellow' : problem.status === 'Completed' ? 'green' : 'inherit' }}>
                                    {new Date(problem.date).toLocaleDateString()}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex">
                        <button
                          className="btn btn-sm btn-outline-primary mx-2"
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={handleNextPage}
                          disabled={currentItems.length < itemsPerPage}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data (Coming Soon)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editRequest">
              <Form.Label>Request:</Form.Label>
              <Form.Control
                type="text"
                value={editedValue ? editedValue.request : ""}
                onChange={(e) => setEditData({ ...editData, request: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editTemporary">
              <Form.Label>No Ticket:</Form.Label>
              <Form.Control
                type="text"
                value={editedValue ? editedValue.temporary : ""}
                onChange={(e) => setEditData({ ...editData, temporary: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editPermanent">
              <Form.Label>Solution:</Form.Label>
              <Form.Control
                type="text"
                value={editedValue ? editedValue.permanent : ""}
                onChange={(e) => setEditData({ ...editData, permanent: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editStatus">
              <Form.Label>Status:</Form.Label>
              <Form.Control
                type="text"
                value={editedValue ? editedValue.status : ""}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editDate">
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="date"
                value={editedValue ? editedValue.date.substring(0, 10) : ""}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}

export default ProblemTable;
