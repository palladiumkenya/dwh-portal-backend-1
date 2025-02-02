import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import { LinelistFACTART } from 'src/care-treatment/common/entities/linelist-fact-art.model';
import {
    GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery
} from "../impl/get-vl-overall-number-with-follow-tests-at-gt1000-copies-secondline-regiment.query";

@QueryHandler(GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery)
export class GetVlOverallNumberWithFollowVlTestsAtGt1000CopiesSecondLineRegimentHandler implements IQueryHandler<GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery): Promise<any> {
        // const vlOverallUptakeAndSuppressionBySex = this.repository.createQueryBuilder('f')
        //     .select(['Last12MVLResult, Gender gender, COUNT ( * ) Num'])
        //     .where('f.MFLCode > 0')
        //     .andWhere('Last12MVLResult IS NOT NULL');

        const vlOverallNumberFollowSecondlineRegiment = this.repository
            .createQueryBuilder('cohort')
            .select([
                `cohort.SiteCode,cohort.PatientID,cohort.County,cohort.SubCounty,DOB,cohort.Gender,LatestVL1 as LastVL,LatestVLDate2Key,LatestVLDate1Key,ARTOutcome,CurrentRegimenLine As CurrentARTLine,
                CASE
                    WHEN ISNUMERIC(LatestVL1)=1 THEN
                        CASE
                            WHEN CAST(Replace(LatestVL1,',','')AS FLOAT) <=50.90 THEN '<1000 Copies'
                            WHEN CAST(Replace(LatestVL1,',','') AS FLOAT) between 51.00 and 399.00 THEN '<1000 Copies'
                            WHEN CAST(Replace(LatestVL1,',','')AS FLOAT) between 400.00 and 999.00 THEN '<1000 Copies'
                            WHEN CAST(Replace(LatestVL1,',','')AS FLOAT) >=1000 THEN '>1000 Copies'
                        END
                    WHEN LatestVL1 IN ('Undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<1000 Copies'
                ELSE NULL END AS [LastVLResult],
                LatestVLDate1Key as DateLAstVL,
                LatestVL2,
                CASE
                    WHEN ISNUMERIC(LatestVL2)=1 THEN
                        CASE
                            WHEN CAST(Replace(LatestVL2,',','')AS FLOAT) <=50.90 THEN '<1000 Copies'
                            WHEN CAST(Replace(LatestVL2,',','') AS FLOAT) between 51.00 and 399.00 THEN '<1000 Copies'
                            WHEN CAST(Replace(LatestVL2,',','')AS FLOAT) between 400.00 and 999.00 THEN '<1000 Copies'
                            WHEN CAST(Replace(LatestVL2,',','')AS FLOAT) >=1000 THEN '>1000 Copies'
                        END
                    WHEN LatestVL2 IN ('Undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<1000 Copies'
                ELSE NULL END AS [VL2Result]`,
            ])
            .leftJoin(
                'LineListViralLoad',
                'c',
                'cohort.Patientid= c.PatientID AND cohort.PatientPK= c.PatientPK  AND cohort.SiteCode= c.MFLCode ',
            );

        if (query.county) {
            vlOverallNumberFollowSecondlineRegiment.andWhere('cohort.County IN (:...counties)', {counties: query.county});
        }
        
        if (query.subCounty) {
            vlOverallNumberFollowSecondlineRegiment.andWhere(
                'cohort.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }
        
        if (query.facility) {
            vlOverallNumberFollowSecondlineRegiment.andWhere(
                'cohort.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }
        
        if (query.partner) {
            vlOverallNumberFollowSecondlineRegiment.andWhere(
                'cohort.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }
        
        if (query.agency) {
            vlOverallNumberFollowSecondlineRegiment.andWhere(
                'cohort.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }
        
        if (query.datimAgeGroup) {
            vlOverallNumberFollowSecondlineRegiment.andWhere(
                'cohort.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }
        
        if (query.gender) {
            vlOverallNumberFollowSecondlineRegiment.andWhere(
                'cohort.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }
        
        const originalQuery = vlOverallNumberFollowSecondlineRegiment.getQuery;
        const originalParams = vlOverallNumberFollowSecondlineRegiment.getParameters;
        vlOverallNumberFollowSecondlineRegiment.getQuery = () => {
            const a = originalQuery.call(
                vlOverallNumberFollowSecondlineRegiment,
            );
            return `WITH VL AS (${a}) SELECT VL2Result, Count (*) Num FROM VL WHERE ARTOutcome='V' and  VL2Result in ('>1000 Copies')  and DATEDIFF(MONTH,LatestVLDate2Key,GETDATE())<= 14 and currentARTline='Second Line' Group by VL2Result`;
        };

        vlOverallNumberFollowSecondlineRegiment.getParameters = () => {
            return originalParams.call(vlOverallNumberFollowSecondlineRegiment);
        };

        return vlOverallNumberFollowSecondlineRegiment.getRawMany();
    }
}
