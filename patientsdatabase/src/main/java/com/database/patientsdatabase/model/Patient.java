package com.database.patientsdatabase.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id", unique = true)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "doctorID", referencedColumnName = "id")
    private Doctor parentDoctor;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "idNumber", unique = true)
    private String idNumber;

    @OneToMany(targetEntity = ContactMember.class, mappedBy = "parentPatient", cascade = CascadeType.ALL)
    private List<ContactMember> contactMembers; //max size = 2

    @OneToMany(targetEntity = Visit.class, mappedBy = "parentPatient", cascade = CascadeType.ALL)
    private List<Visit> visits;

    public Patient(Long id, String name, String surname, String idNumber) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.idNumber = idNumber;
    }

    public Patient() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getParentDoctor() {
        return this.parentDoctor;
    }

    public void setParentDoctor(Doctor doctor) {
        this.parentDoctor = doctor;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public List<ContactMember> getContactMembers() {
        return contactMembers;
    }

    public void setContactMembers(List<ContactMember> contactMembers) {
        this.contactMembers = contactMembers;
    }

    public List<Visit> getVisits() {
        return visits;
    }

    public void setVisits(List<Visit> visits) {
        this.visits = visits;
    }

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", idNumber='" + idNumber + '\'' +
                ", contactMembers=" + contactMembers +
                ", visits=" + visits +
                '}';
    }
}
