package com.database.patientsdatabase.repo;

import com.database.patientsdatabase.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientsRepo extends JpaRepository<Patient, Long> {
    @Query("SELECT new com.database.patientsdatabase.model.Patient(id, name, surname, idNumber) FROM Patient WHERE parentDoctor.id = :idDoctor")
    List<Patient> getPatients(@Param("idDoctor") Long idDoctor);

    @Query("select new com.database.patientsdatabase.model.Patient(id, name, surname, idNumber) from Patient where id = :idPatient")
    Patient getSelectedPatient(@Param("idPatient") Long idPatient);

    @Query("select new com.database.patientsdatabase.model.Patient(p.id, p.name, p.surname, p.idNumber) from Patient p join Doctor d on p.parentDoctor.id = d.id where p.id = :idPatient and d.doctorCode = :uuid")
    Patient safeGetSelectedPatient(@Param("idPatient") Long idPatient, @Param("uuid") String uuid);

//    @Query("select new com.database.patientsdatabase.model.Patient(p.id, p.name, p.surname, p.idNumber) from Patient p join Doctor d on p.parentDoctor.id = d.id where p.id = :idPatient and d.doctorCode = :uuid")
//    Patient checkForPatient(@Param("name") String name,@Param("surname") Long idPatient,@Param("idPatient") Long idPatient, @Param("uuid") String uuid);

    @Modifying
    @Query("update Patient p set p.name = :newName, p.surname = :newSurname, p.idNumber = :newIdNumber where p.id = :patientID")
    void updatePatient(@Param("newName") String name, @Param("newSurname") String surname, @Param("newIdNumber") String idNumber, @Param("patientID") Long id);
}
