package com.database.patientsdatabase.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor implements Serializable {

    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; //equals 5 min

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id", unique = true)
    private Long id;

    @Column(nullable = false, updatable = false, name = "login", unique = true)
    private String login;

    @Column(name = "password")
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "giftcardNumber")
    private String giftcardNumber;

    @Column(name = "doctorUUID", unique = true)
    private String doctorCode;

    @Column(name = "otp")
    private String otp;

    @Column(name = "otpRequestTime")
    private Date otpRequestedTime;

    @OneToMany(targetEntity = Patient.class, mappedBy = "parentDoctor", cascade = CascadeType.ALL)
    private List<Patient> patients;

    public Doctor(long id, String email, String password, String login, String giftcard, String doctorCode, String otp, Date otpRequestedTime) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.login = login;
        this.giftcardNumber = giftcard;
        this.doctorCode = doctorCode;
        this.otp = otp;
        this.otpRequestedTime = otpRequestedTime;
    }

    public Doctor() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGiftcardNumber() {
        return giftcardNumber;
    }

    public void setGiftcardNumber(String giftcardNumber) {
        this.giftcardNumber = giftcardNumber;
    }

    public String getDoctorCode() {
        return doctorCode;
    }

    public void setDoctorCode(String doctorCode) {
        this.doctorCode = doctorCode;
    }

    public String getOtp() {
        return this.otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public Date getOtpRequestedTime() {
        return this.otpRequestedTime;
    }

    public void setOtpRequestedTime(Date requestedTime) {
        this.otpRequestedTime = requestedTime;
    }

//    public boolean isOTPrequired() {
//        long currTime = System.currentTimeMillis();
//        long otpRequestedTime = this.getOtpRequestedTime().getTime();
//        if (this.getOtp() == null || (otpRequestedTime + OTP_VALID_DURATION < currTime)) {
//            return false;
//        }
//        return true;
//    }

    public boolean otpMatches(Doctor otherDoctor) {
        long currTime = System.currentTimeMillis();
        if (this.otp.equals(otherDoctor.getOtp()) &&
                (currTime < otherDoctor.getOtpRequestedTime().getTime() + OTP_VALID_DURATION)) {
            return true;
        }
        return false;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }

    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", giftcardNumber='" + giftcardNumber + '\'' +
                ", patients=" + patients +
                '}';
    }
}
