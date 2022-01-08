package com.database.patientsdatabase.repo;

import com.database.patientsdatabase.model.ContactMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactMembersRepo extends JpaRepository<ContactMember, Long> {

    @Query("select new com.database.patientsdatabase.model.ContactMember(id, name, surname, phoneNumber) from ContactMember where parentPatient.id = :idPatient")
    List<ContactMember> getContactMembers(@Param("idPatient") Long idPatient);

    @Modifying
    @Query("update ContactMember cm set cm.name = :newName, cm.surname = :newSurname, cm.phoneNumber = :newPhoneNumber where cm.id = :memberID")
    void updateContactMember(@Param("newName") String name, @Param("newSurname") String surname, @Param("newPhoneNumber") String phoneNumber, @Param("memberID") Long id);

}
