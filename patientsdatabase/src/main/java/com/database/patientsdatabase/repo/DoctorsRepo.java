package com.database.patientsdatabase.repo;

import com.database.patientsdatabase.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoctorsRepo extends JpaRepository<Doctor, Long> {

    @Query("SELECT new com.database.patientsdatabase.model.Doctor(id, email, password, login, giftcardNumber, doctorCode, otp, otpRequestedTime)FROM Doctor WHERE login = :loginData")
    Doctor getSelectedDoctor(@Param("loginData") String loginData);

    @Query("SELECT new com.database.patientsdatabase.model.Doctor(id, email, password, login, giftcardNumber, doctorCode, otp, otpRequestedTime)FROM Doctor WHERE id = :idDoctor")
    Doctor getSelectedDoctorByID(@Param("idDoctor") Number idDoctor);

}
