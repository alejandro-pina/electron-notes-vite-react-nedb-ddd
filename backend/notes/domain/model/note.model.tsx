import VOFormatException from '../errors/vo-format.exception';
import UuidVO from '../value-objects/uuid.vo';
import DescriptionVO from '../value-objects/description.vo';
import DateTimeVO from '../value-objects/date.vo';

export class NoteModel {
    /**
     * @param {UuidVO} id Note unique identifier
     * @param {DescriptionVO} description Note description
     * @param {DateTimeVO} [createdAt] Date of creation
     * @param {DateTimeVO} [updatedAt] Date of last update
     */
    constructor(
        public id: UuidVO,
        public description: DescriptionVO,
        public createdAt?: DateTimeVO | Date,
        public updatedAt?: DateTimeVO | Date
    ) {
        this.assertIsValid(id, description, createdAt, updatedAt);
    }

    private assertIsValid(
        id: UuidVO,
        description: DescriptionVO,
        createdAt?: DateTimeVO | Date,
        updatedAt?: DateTimeVO | Date
    ) {
        if (!(id instanceof UuidVO)) {
            
            throw new VOFormatException('id');
        }
        if (!(description instanceof DescriptionVO)) {
            
            throw new VOFormatException('description');
        }
        if (createdAt && !(createdAt instanceof DateTimeVO) && !(createdAt instanceof Date)) {
            
            throw new VOFormatException('createdAt');
        }
        if (updatedAt && !(updatedAt instanceof DateTimeVO) && !(updatedAt instanceof Date)) {
            
            throw new VOFormatException('updatedAt');
        }
    }
}
