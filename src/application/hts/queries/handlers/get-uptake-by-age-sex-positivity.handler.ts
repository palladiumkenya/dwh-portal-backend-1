import { GetUptakeByAgeSexPositivityQuery } from '../get-uptake-by-age-sex-positivity.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptakeAgeGender } from '../../../../entities/hts/fact-htsuptake-agegender.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByAgeSexPositivityQuery)
export class GetUptakeByAgeSexPositivityHandler implements IQueryHandler<GetUptakeByAgeSexPositivityQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ) {}

    async execute(query: GetUptakeByAgeSexPositivityQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexSql = 'SELECT \n' +
            'DATIM_AgeGroup AS AgeGroup,\n' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity \n' +
            'FROM fact_hts_agegender \n' +
            'WHERE Tested IS NOT NULL ';

        if(query.county) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and County=?`;
            params.push(query.county);
        }

        if(query.month) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and FacilityName=?`;
            params.push(query.facility);
        }

        uptakeByAgeSexSql = `${uptakeByAgeSexSql} GROUP BY DATIM_AgeGroup`;
        return  await this.repository.query(uptakeByAgeSexSql, params);
    }
}
