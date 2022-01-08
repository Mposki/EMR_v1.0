package com.database.patientsdatabase.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "treatments")
public class Treatment {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id", unique = true)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "visitID", referencedColumnName = "id")
    private Visit parentVisit;

    @Column(name = "date")
    private String date;

    @Column(name = "details")
    private String details;

    public Treatment(Long id, String date, String details) {
        this.id = id;
        this.date = date;
        this.details = details;
    }

    public Treatment() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Visit getParentVisit() {
        return parentVisit;
    }

    public void setParentVisit(Visit parentVisit) {
        this.parentVisit = parentVisit;
    }

    @Override
    public String toString() {
        return "Treatment{" +
                "id=" + id +
                ", date='" + date + '\'' +
                ", details='" + details + '\'' +
                '}';
    }
}
