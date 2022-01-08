package com.database.patientsdatabase.service;

import com.database.patientsdatabase.model.*;
import com.database.patientsdatabase.repo.*;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.transaction.Transactional;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class DoctorService {
    @Autowired
    private final DoctorsRepo doctorsRepo;

    @Autowired
    private final PatientsRepo patientsRepo;

    @Autowired
    private final TreatmentsRepo treatmentsRepo;

    @Autowired
    private final VisitsRepo visitsRepo;

    @Autowired
    private final ContactMembersRepo contactMembersRepo;

    @Autowired
    private final JavaMailSender mailSender;

    public DoctorService(DoctorsRepo doctorsRepo, PatientsRepo patientsRepo, TreatmentsRepo treatmentsRepo, VisitsRepo visitsRepo, ContactMembersRepo contactMembersRepo) {
        this.doctorsRepo = doctorsRepo;
        this.patientsRepo = patientsRepo;
        this.treatmentsRepo = treatmentsRepo;
        this.visitsRepo = visitsRepo;
        this.contactMembersRepo = contactMembersRepo;
        this.mailSender = new JavaMailSenderImpl();
    }


    public Doctor addDoctor(Doctor doctor) {
        return doctorsRepo.save(doctor);
    }

    public String deleteDoctor(Long id) {
        doctorsRepo.deleteById(id);
        return "Doctor " + id + " deleted";
    }

    public Doctor getDoctor(String login) {
        return doctorsRepo.getSelectedDoctor(login);
    }

    public Doctor getDoctorByID(Long id) {
        return doctorsRepo.getSelectedDoctorByID(id);
    }


    public Patient addPatient( Patient patient) {
        return patientsRepo.save(patient);
    }

    public List<Patient> getPatients(Long idDoctor) {
        return patientsRepo.getPatients(idDoctor);
    }

    public Patient getPatient(Long idPatient, String uuid) {
        return patientsRepo.safeGetSelectedPatient(idPatient, uuid);
    }

    public Patient getPatientQuick(Long idPatient) {
        return patientsRepo.findById(idPatient).get();
    }

    public Patient updateCompletePatient(Patient patient) {
        patientsRepo.updatePatient(patient.getName(), patient.getSurname(), patient.getIdNumber(), patient.getId());
        List<Visit> visits = patient.getVisits();
        List<ContactMember> contactMembers = patient.getContactMembers();
        if(!visits.isEmpty()) {
            for(Visit visit : visits) {
                List<Treatment> treatments = visit.getTreatments();
                if(!treatments.isEmpty()) {
                    for(Treatment treatment : treatments) {
                        treatmentsRepo.updateTreatment(treatment.getDate(), treatment.getDetails(), treatment.getId());
                    }
                }
                visitsRepo.updateVisit(visit.getDateStart(), visit.getDateEnd(), visit.getDiagnosis(), visit.getRecognition(), visit.getId());
            }
        }
        if(!contactMembers.isEmpty()) {
            for(ContactMember contactMember : contactMembers) {
                contactMembersRepo.updateContactMember(contactMember.getName(), contactMember.getSurname(), contactMember.getPhoneNumber(), contactMember.getId());
            }
        }
        return patientsRepo.getSelectedPatient(patient.getId());
    }

    public Patient updatePatient(Patient patient) {
        patientsRepo.updatePatient(patient.getName(), patient.getSurname(), patient.getIdNumber(), patient.getId());
        return patientsRepo.getSelectedPatient(patient.getId());
    }

    public String deletePatient(Long id) {
        patientsRepo.deleteById(id);
        return "Patient " + id + " deleted";
    }


    public ContactMember addContactMember(ContactMember contactMember) {
        return contactMembersRepo.save(contactMember);
    }

    public List<ContactMember> getContactMemebers(Long idPatient) {
        return contactMembersRepo.getContactMembers(idPatient);
    }

    public ContactMember updateContactMember(ContactMember contactMember) {
        contactMembersRepo.updateContactMember(contactMember.getName(), contactMember.getSurname(), contactMember.getPhoneNumber(), contactMember.getId());
        return contactMembersRepo.findById(contactMember.getId()).get();
    }

    public String deleteContactMember(ContactMember contactMember) {
        contactMembersRepo.deleteById(contactMember.getId());
        return "Contact member " + contactMember.getId() + " deleted";
    }


    public Visit addVisit(Visit visit) {
        return visitsRepo.save(visit);
    }

    public List<Visit> getVisits(Long idPatient) {
        return visitsRepo.getVisits(idPatient);
    }

    public Visit getVisit(Long idVisit) {
        return visitsRepo.findById(idVisit).get();
    }

    public Visit updateVisit(Visit visit) {
        visitsRepo.updateVisit(visit.getDateStart(), visit.getDateEnd(), visit.getDiagnosis(), visit.getRecognition(), visit.getId());
        return visitsRepo.findById(visit.getId()).get();
    }

    public String deleteVisit(Long idVisit) {
        visitsRepo.deleteById(idVisit);
        return "Visit: " + idVisit + " deleted";
    }


    public Treatment addTreatment(Treatment treatment) {
        return treatmentsRepo.save(treatment);
    }

    public List<Treatment> getTreatments(Long idVisit) {
        return treatmentsRepo.getTreatments(idVisit);
    }

    public Treatment updateTreatment(Treatment treatment) {
        treatmentsRepo.updateTreatment(treatment.getDate(), treatment.getDetails(), treatment.getId());
        return treatmentsRepo.findById(treatment.getId()).get();
    }

    public String deleteTreatment(Long idTreatment) {
        treatmentsRepo.deleteById(idTreatment);
        return "Treatment: " + idTreatment + " deleted";
    }


    public void generateANDsaveOTP(Doctor doctor) throws MessagingException, UnsupportedEncodingException {
        String otp = RandomString.make(8);
        doctor.setOtp(otp);
        doctor.setOtpRequestedTime(new Date());
        doctorsRepo.save(doctor);
        sendOTP(doctor, otp);
    }

    public void sendOTP(Doctor doctor, String otp) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("automat.pzp@outlook.com", "Administrator PZP");
        helper.setTo(doctor.getEmail());

        String subject = "Oto Twój jednorazowy kod autoryzujący (OTP) - Wygaśnie za 5 minut!";

        String content = "<p>Witaj " + doctor.getLogin() + "</p>"
                + "<p>Z powodu zabezpieczeń wynikających z polityki produktu "
                + "wysyłam Ci kod OTP (One Time Password).</p>"
                + "Użyj go, aby potwierdzić operację:</p>"
                + "<p><b>" + otp + "</b></p>"
                + "<br>"
                + "<p>Kod OTP straci ważność po 5 minutach od jego uzyskania.</p>";

        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public Doctor clearOTP(Doctor doctor) {
        doctor.setOtp("null");
        return doctorsRepo.save(doctor);
    }
}
