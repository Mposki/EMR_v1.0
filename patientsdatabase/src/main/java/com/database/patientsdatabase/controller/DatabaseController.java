package com.database.patientsdatabase.controller;

import com.database.patientsdatabase.model.*;
import com.database.patientsdatabase.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class DatabaseController {

    /**
     * TODO
     * ERROR HANDLING!!!!!!!!!!!!!!!!!!!!!!
     * HTTP- GET instead of POST with data in url like /patient/details/{id}
     */

    private final DoctorService doctorService;

    public DatabaseController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // if OTP is invalid 3 times in row- delete new doctor
    @PutMapping("/register")
    public ResponseEntity<String> registerDoctor(@RequestBody Doctor doctor) {
        if(checkDoctor(doctor)) {
            doctor.setDoctorCode(UUID.randomUUID().toString());
            return generateOTP(doctor);
        }
        return new ResponseEntity<>("Doctor exists!", HttpStatus.CONFLICT);
    }

    @PostMapping("/login")
    public ResponseEntity<String> verifyDoctor(@RequestBody Doctor doctor) {
        Doctor newDoctor = doctorService.getDoctor(doctor.getLogin());
        if(newDoctor != null) {
            if (!newDoctor.getPassword().equals(doctor.getPassword())) {
                return new ResponseEntity<>("Password failure", HttpStatus.BAD_REQUEST);
            }
            return generateOTP(newDoctor);
        }
        return new ResponseEntity<>("No user", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/login/verify")
    public ResponseEntity<Doctor> getDoctor(@RequestBody Doctor doctor) {
        Doctor newDoctor = doctorService.getDoctor(doctor.getLogin());
        if (doctor.otpMatches(newDoctor)) {
            newDoctor = doctorService.clearOTP(newDoctor);
            newDoctor.setPatients(doctorService.getPatients(newDoctor.getId()));
            return new ResponseEntity<>(newDoctor, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/patient/details/{id}")
    public ResponseEntity<Patient> getPatientData(@PathVariable("id") Long id, @RequestBody Doctor doctor) {
        Patient patient = doctorService.getPatient(id, doctor.getDoctorCode());
        patient.setContactMembers(doctorService.getContactMemebers(id));
        patient.setVisits(doctorService.getVisits(id));
        List<Visit> visits = patient.getVisits();
        for(Visit element : visits) {
            element.setTreatments(doctorService.getTreatments(element.getId()));
        }
        patient.setVisits(visits);
        return new ResponseEntity<>(patient, HttpStatus.OK);
    }

    @PutMapping("/patient/add")
    public ResponseEntity<Patient> savePatient(@RequestBody Doctor doctor) {
        Doctor currDoctor = doctorService.getDoctorByID(doctor.getId());
        doctor.getPatients().get(0).setParentDoctor(currDoctor);
        Patient newPatient;
        try {
            newPatient = doctorService.addPatient(doctor.getPatients().get(0));
            newPatient = doctorService.getPatient(newPatient.getId(), doctor.getDoctorCode());
            return new ResponseEntity<>(newPatient, HttpStatus.CREATED);
        } catch (Error e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/patient/details/add")
    public ResponseEntity<Patient> savePatientDetails(@RequestBody Patient patient) {
        return new ResponseEntity<>(patient, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/delete/{id}")
    public ResponseEntity<String> verifyDeleteDoctor(@PathVariable("id") Long id) {
        Doctor doctor = doctorService.getDoctorByID(id);
        return generateOTP(doctor);
    }

    @PostMapping("/doctor/delete/verify")
    public ResponseEntity<String> deleteDoctor(@RequestBody Doctor doctor) {
        Doctor newDoctor = doctorService.getDoctor(doctor.getLogin());
        if (doctor.otpMatches(newDoctor)) {
            return new ResponseEntity<>(doctorService.deleteDoctor(newDoctor.getId()), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/patient/delete/verify/{id}")
    public ResponseEntity<String> verifyDeletePatient(@PathVariable("id") Long id, @RequestBody Doctor doctor) {
        Patient tempPatient = doctorService.getPatient(id, doctor.getDoctorCode());
        if (tempPatient != null) {
            Doctor newDoctor = doctorService.getDoctorByID(doctor.getId());
            return generateOTP(newDoctor);
        }
        return new ResponseEntity<>("Invalid patient!", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/patient/delete/{id}")
    public ResponseEntity<Doctor> deletePatient(@PathVariable("id") Long id, @RequestBody Doctor doctor) {
        Doctor newDoctor = doctorService.getDoctor(doctor.getLogin());
        if (doctor.otpMatches(newDoctor)) {
            Patient tempPatient = doctorService.getPatient(id, doctor.getDoctorCode());
            if (tempPatient != null) {
                doctorService.deletePatient(id);
                newDoctor = doctorService.getDoctorByID(newDoctor.getId());
                newDoctor.setPatients(doctorService.getPatients(newDoctor.getId()));
                return new ResponseEntity<>(newDoctor, HttpStatus.OK);

            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PostMapping("/patient/update")
    public ResponseEntity<Patient> updatePatient(@RequestBody Patient patient) {
        return new ResponseEntity<>(doctorService.updatePatient(patient), HttpStatus.OK);
    }

    @PostMapping("/patient/details/update")
    public ResponseEntity<Patient> updateCompletePatient(@RequestBody Patient patient) {
        return new ResponseEntity<>(doctorService.updateCompletePatient(patient), HttpStatus.OK);
    }


    @PostMapping("/patient/details/contact-member/add")
    public ResponseEntity<ContactMember> addContactMember(@RequestBody Patient patient) {
        Patient newPatient = doctorService.getPatientQuick(patient.getId());
        ContactMember newContactMember = patient.getContactMembers().get(0);
        newContactMember.setParentPatient(newPatient);
        return new ResponseEntity<>(doctorService.addContactMember(newContactMember), HttpStatus.CREATED);
    }

    @PostMapping("/patient/details/contact-member/update")
    public ResponseEntity<ContactMember> updateContactMember(@RequestBody ContactMember contactMember) {
        return new ResponseEntity<>(doctorService.updateContactMember(contactMember), HttpStatus.OK);
    }

    @PostMapping("/patient/details/contact-member/delete")
    public ResponseEntity<String> deleteContactMember(@RequestBody ContactMember contactMember) {
        return new ResponseEntity<>(doctorService.deleteContactMember(contactMember), HttpStatus.OK);
    }


    @PostMapping("/patient/details/visit/add")
    public ResponseEntity<Visit> addVisit(@RequestBody Patient patient) {
        Patient newPatient = new Patient();
        newPatient.setId(patient.getId());
        Visit newVisit = patient.getVisits().get(0);
        newVisit.setParentPatient(newPatient);
        return new ResponseEntity<>(doctorService.addVisit(newVisit), HttpStatus.OK);
    }

    @PostMapping("/patient/details/visit/update")
    public ResponseEntity<Visit> updateVisit(@RequestBody Visit visit) {
        return new ResponseEntity<>(doctorService.updateVisit(visit), HttpStatus.OK);
    }

    @PostMapping("/patient/details/visit/delete")
    public ResponseEntity<String> deleteVisit(@RequestBody Visit visit) {
        return new ResponseEntity<>(doctorService.deleteVisit(visit.getId()), HttpStatus.OK);
    }


    @PostMapping("/patient/details/treatment/add")
    public ResponseEntity<Treatment> addTreatment(@RequestBody Visit visit) {
        Visit newVisit = new Visit();
        newVisit = doctorService.getVisit(visit.getId());
        Treatment newTreatment = visit.getTreatments().get(0);
        newTreatment.setParentVisit(newVisit);
        return new ResponseEntity<>(doctorService.addTreatment(newTreatment), HttpStatus.OK);
    }

    @PostMapping("/patient/details/treatment/update")
    public ResponseEntity<Treatment> updateTreatment(@RequestBody Treatment treatment) {
        return new ResponseEntity<>(doctorService.updateTreatment(treatment), HttpStatus.OK);
    }

    @PostMapping("/patient/details/treatment/delete")
    public ResponseEntity<String> deleteTreatment(@RequestBody Treatment treatment) {
        return new ResponseEntity<>(doctorService.deleteTreatment(treatment.getId()), HttpStatus.OK);
    }


    private ResponseEntity<String> generateOTP(Doctor doctor) {
        try {
            doctorService.generateANDsaveOTP(doctor);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>("OTP send", HttpStatus.NO_CONTENT);
    }

    private boolean checkDoctor(Doctor doctor) {
        Doctor newDoctor = doctorService.getDoctor(doctor.getLogin());
        if (newDoctor != null) {
            return false;
        }
        return true;
    }



}
