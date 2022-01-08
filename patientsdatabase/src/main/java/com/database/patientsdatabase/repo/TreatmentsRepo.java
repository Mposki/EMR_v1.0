package com.database.patientsdatabase.repo;

import com.database.patientsdatabase.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TreatmentsRepo extends JpaRepository<Treatment, Long> {

    @Query("select new com.database.patientsdatabase.model.Treatment(id, date, details) from Treatment where parentVisit.id = :idVisit")
    List<Treatment> getTreatments(@Param("idVisit") Long idVisit);

    @Modifying
    @Query("update Treatment t set t.date = :newDate, t.details = :newDetails where t.id = :treatmentID")
    void updateTreatment(@Param("newDate") String date, @Param("newDetails") String details, @Param("treatmentID") Long id);

}
