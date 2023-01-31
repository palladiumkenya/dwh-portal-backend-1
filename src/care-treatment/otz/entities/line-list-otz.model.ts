import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LineListOTZ')
export class LineListOTZ {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    OTZEnrollmentDateKey: number;

    @Column('int')
    LastVisitDateKey: number;

    @Column('text')
    TransitionAttritionReason: string;

    @Column('text')
    TransferInStatus: string;

    @Column('text')
    ModulesPreviouslyCovered: string;

    @Column('int')
    CompletedToday_OTZ_Orientation: number;

    @Column('int')
    CompletedToday_OTZ_Participation: number;

    @Column('int')
    CompletedToday_OTZ_Leadership: number;

    @Column('int')
    CompletedToday_OTZ_MakingDecisions: number;

    @Column('int')
    CompletedToday_OTZ_Transition: number;

    @Column('int')
    CompletedToday_OTZ_TreatmentLiteracy: number;

    @Column('int')
    CompletedToday_OTZ_SRH: number;

    @Column('int')
    CompletedToday_OTZ_Beyond: number;

    @Column('text')
    FirstVL: string;

    @Column('text')
    LastVL: string;

    @Column('int')
    EligibleVL: number;

    @Column('date')
    Last12MonthVLResults: Date;

    @Column('text')
    Last12MVLResult: string;

    @Column('int')
    Last12MonthVL: number;
}