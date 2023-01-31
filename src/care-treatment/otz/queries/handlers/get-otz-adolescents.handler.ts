import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsQuery } from '../impl/get-otz-adolescents.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListALHIV } from './../../entities/line-list-alhiv.model';

@QueryHandler(GetOtzAdolescentsQuery)
export class GetOtzAdolescentsHandler implements IQueryHandler<GetOtzAdolescentsQuery> {
    constructor(
        @InjectRepository(LineListALHIV, 'mssql')
        private readonly repository: Repository<LineListALHIV>
    ) {
    }

    async execute(query: GetOtzAdolescentsQuery): Promise<any> {
        const otzTotalAdolescents = this.repository.createQueryBuilder('f')
            .select(['count(*) totalAdolescents, Gender']);

        if (query.county) {
            otzTotalAdolescents.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzTotalAdolescents.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzTotalAdolescents.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzTotalAdolescents.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzTotalAdolescents.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzTotalAdolescents.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzTotalAdolescents.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzTotalAdolescents
            .groupBy('Gender')
            .orderBy('Gender')
            .getRawMany();
    }
}
