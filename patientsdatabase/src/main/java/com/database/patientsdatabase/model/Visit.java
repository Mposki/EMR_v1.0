package com.database.patientsdatabase.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "id", unique = true)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "patientID", referencedColumnName = "id")
    private Patient parentPatient;

    @Column(name = "dateStart")
    private String dateStart;

    @Column(name = "dateEnd")
    private String dateEnd;

    @Column(name = "recognition")
    private String recognition;

    @Column(name = "diagnosis")
    private String diagnosis;

    @OneToMany(targetEntity = Treatment.class, mappedBy = "parentVisit", cascade = CascadeType.ALL)
    private List<Treatment> treatments;

    public Visit(Long id, String dateStart, String dateEnd, String recognition, String diagnosis) {
        this.id = id;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.recognition = recognition;
        this.diagnosis = diagnosis;
    }

    public Visit() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getRecognition() {
        return recognition;
    }

    public void setRecognition(String recognition) {
        this.recognition = recognition;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public List<Treatment> getTreatments() {
        return treatments;
    }

    public void setTreatments(List<Treatment> treatments) {
        this.treatments = treatments;
    }

    public Patient getParentPatient() {
        return parentPatient;
    }

    public void setParentPatient(Patient parentPatient) {
        this.parentPatient = parentPatient;
    }

    @Override
    public String toString() {
        return "Visit{" +
                "id=" + id +
                ", dateStart='" + dateStart + '\'' +
                ", dateEnd='" + dateEnd + '\'' +
                ", recognition='" + recognition + '\'' +
                ", diagnosis='" + diagnosis + '\'' +
                ", treatments=" + treatments +
                '}';
    }
}
