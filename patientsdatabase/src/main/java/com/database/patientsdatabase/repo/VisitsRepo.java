package com.database.patientsdatabase.repo;

import com.database.patientsdatabase.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VisitsRepo extends JpaRepository<Visit, Long> {

    @Query("select new com.database.patientsdatabase.model.Visit(id, dateStart, dateEnd, recognition, diagnosis) from Visit where parentPatient.id = :idPatient")
    List<Visit> getVisits(@Param("idPatient") Long idPatient);

    @Modifying
    @Query("update Visit v set v.dateStart = :newDateStart, v.dateEnd = :newDateEnd, v.diagnosis = :newDiagnosis, v.recognition = :newRecognition where v.id = :visitID")
    void updateVisit(@Param("newDateStart") String dateStart, @Param("newDateEnd") String dateEnd, @Param("newDiagnosis") String diagnosis, @Param("newRecognition") String recognition, @Param("visitID") Long id);
}
