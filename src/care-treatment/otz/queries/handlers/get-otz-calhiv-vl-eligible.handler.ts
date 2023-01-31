import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzCalhivVlEligibleQuery } from '../impl/get-otz-calhiv-vl-eligible.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { LineListALHIV } from './../../entities/line-list-alhiv.model';

@QueryHandler(GetOtzCalhivVlEligibleQuery)
export class GetOtzCalhivVlEligibleHandler implements IQueryHandler<GetOtzCalhivVlEligibleQuery> {
    constructor(
        @InjectRepository(LineListALHIV, 'mssql')
        private readonly repository: Repository<LineListALHIV>
    ) {
    }

    async execute(query: GetOtzCalhivVlEligibleQuery): Promise<any> {
        const OTZCALHIVVLEligible = this.repository.createQueryBuilder('f')
            .select('Count (*)CALHIVEligible')
            .andWhere('f.EligibleVL=1');

        if (query.county) {
            OTZCALHIVVLEligible.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OTZCALHIVVLEligible.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OTZCALHIVVLEligible.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OTZCALHIVVLEligible.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OTZCALHIVVLEligible.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            OTZCALHIVVLEligible.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            OTZCALHIVVLEligible.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await OTZCALHIVVLEligible.getRawOne();
    }
}
