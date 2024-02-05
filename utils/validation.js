import { body, query, check, param } from 'express-validator';

export const crAnnVal = [
    body('event_type').notEmpty().withMessage('event_type cannot be empty.').isString().withMessage("event_type must be a string."),
    body('priority').notEmpty().withMessage('priority cannot be empty.').isString().withMessage("priority must be a string."),
    body('from_date').notEmpty().withMessage('from_date cannot be empty.').isDate().withMessage("from_date must be a date."), 
    body('to_date').notEmpty().withMessage('to_date cannot be empty.').isDate().withMessage("to_date must be a date."),
    body('title').notEmpty().withMessage('title cannot be empty.').isDate().withMessage("title must be a string."),
    body('description').notEmpty().withMessage('description cannot be empty.').isDate().withMessage("description must be a string.")
]

export const upAnnVal = [
    body('priority').optional().notEmpty().withMessage('priority cannot be empty.').isString().withMessage("priority must be a string."),
    body('to_date').notEmpty().withMessage('to_date cannot be empty.').isDate().withMessage("to_date must be a date."),
    body('from_date').notEmpty().withMessage('from_date cannot be empty.').isDate().withMessage("from_date must be a date.")
]
export const delAnnVal = [
    body('id').notEmpty().withMessage('id cannot be empty.').isInt().withMessage("id must be an integer."),
]

export const assAppVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('foreign_id').notEmpty().withMessage('foreign_id cannot be empty.').isAlphanumeric().withMessage('foreign_id must be alphanumeric.'),
    body('status').notEmpty().withMessage('status cannot be empty.').isString().withMessage("status must be a string."),
    body('item').notEmpty().withMessage('item cannot be empty.').isString().withMessage("item must be a string."),
    body('request_type').notEmpty().withMessage('request_type cannot be empty.').isString().withMessage("request_type must be a string."),
]

export const crAssVal = [
    body('asset_type').notEmpty().withMessage('asset_type cannot be empty.').isString().withMessage("asset_type must be a string."),
    body('item').notEmpty().withMessage('item cannot be empty.').isString().withMessage("item must be a string."),
    body('purchase_date').notEmpty().withMessage('purchase_date cannot be empty.').isDate().withMessage("purchase_date must be a date."),
    body('warranty_period').notEmpty().withMessage('warranty_period cannot be empty.').isInt().withMessage("warranty_period must be an integer."),
    body('price').notEmpty().withMessage('price cannot be empty.').isInt().withMessage("price must be an integer."),
    body('model_number').notEmpty().withMessage('model_number cannot be empty.').isAlphanumeric().withMessage('model_number must be alphanumeric.'),
    body('item_description').optional().notEmpty().withMessage('item_description cannot be empty.').isString().withMessage("item_description must be a string."),
    body('image_url').optional().notEmpty().withMessage('image_url cannot be empty.').isString().withMessage("image_url must be a string."),
]
export const assReqVal = [
    body('asset_type').notEmpty().withMessage('asset_type cannot be empty.').isString().withMessage("asset_type must be a string."),
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('item').notEmpty().withMessage('item cannot be empty.').isString().withMessage("item must be a string."),
    body('primary_purpose').notEmpty().withMessage('primary_purpose cannot be empty.').isString().withMessage("primary_purpose must be a string."),
    body('requirement_type').notEmpty().withMessage('requirement_type cannot be empty.').isString().withMessage("requirement_type must be a string."),
    body('request_type').notEmpty().withMessage('request_type cannot be empty.').isString().withMessage("request_type must be a string."),
    body('details').notEmpty().withMessage('details cannot be empty.').isString().withMessage("details must be a string."),
]

export const fetUserAssVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
]

export const delAssVal = [
    body('asset_id').notEmpty().withMessage('asset_id cannot be empty.').isAlphanumeric().withMessage('asset_id must be alphanumeric.'),
]

export const upAssVal = [
    param('id').notEmpty().withMessage('id cannot be empty.').isAlphanumeric().withMessage('id must be an alphanumeric')
]

export const addTrnVal = [
    body('course_name').notEmpty().withMessage('course_name cannot be empty.').isString().withMessage("course_name must be a string."),
    body('course_description').notEmpty().withMessage('course_description cannot be empty.').isString().withMessage("course_description must be a string."),
    body('roadmap_url').notEmpty().withMessage('roadmap_url cannot be empty.').isString().withMessage("roadmap_url must be a string."),
    body('details').notEmpty().withMessage('details cannot be empty.').isString().withMessage("details must be a string."),
]

export const reqTrnVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('request_type').notEmpty().withMessage('request_type cannot be empty.').isString().withMessage("request_type must be a string."),
    body('progress_status').notEmpty().withMessage('progress_status cannot be empty.').isString().withMessage("progress_status must be a string."),
    body('training_id').notEmpty().withMessage('training_id cannot be empty.').isAlphanumeric().withMessage('training_id must be alphanumeric.'),
]
export const getTrnVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
]

export const delTrnVal = [
    body('training_id').notEmpty().withMessage('training_id cannot be empty.').isAlphanumeric().withMessage('training_id must be alphanumeric.'),
]

export const upTrnVal =[
    param('id').notEmpty().withMessage('id cannot be empty.').isAlphanumeric().withMessage('id must be an alphanumeric')
]

const passwordValidation = (value) => {
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, and one special character.');
    }
    return true;
};

const isValidBloodGroup = (value) => /^(A|B|AB|O)[+-]$/.test(value);

export const userRegVal = [
    body('username').notEmpty().withMessage('username cannot be empty.').isString().withMessage("username must be a string."),
    body('first_name').notEmpty().withMessage('first_name cannot be empty.').isString().withMessage("first_name must be a string."),
    body('last_name').notEmpty().withMessage('last_name cannot be empty.').isString().withMessage("last_name must be a string."),
    body('email').isEmail().withMessage('Invalid email input.').notEmpty().withMessage('Email cannot be empty.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password cannot be empty.').custom(passwordValidation),
    body('state_name').notEmpty().withMessage('state_name cannot be empty.').isString().withMessage("state_name must be a string."),
    body('city_name').notEmpty().withMessage('city_name cannot be empty.').isString().withMessage("city_name must be a string."),
    body('profile_picture').optional().notEmpty().withMessage('profile_picture cannot be empty.').isURL().withMessage('Invalid URL format'),
    body('blood_group').custom((value) => isValidBloodGroup(value)).withMessage('Invalid blood group format'),
    body('mobile_number').isEmpty().withMessage('mobile_number cannot be empty')
    .isInt().withMessage('mobile_number should be an integer').isLength({ min: 10, max: 10 }).withMessage('mobile_number must be of 10 digits.'),
    body('emergency_contact_number').isEmpty().withMessage('emergency_contact_number cannot be empty.')
    .isInt().withMessage('emergency_contact_number should be an integer.').isLength({ min: 10, max: 10 }).withMessage('emergency_contact_number must be of 10 digits.'),
    body('emergency_contact_person_info').optional().isEmpty().withMessage('emergency_contact_person_info cannot be empty.')
    .isString().withMessage('emergency_contact_person_info must be a string.'),
    body('address').isEmpty().withMessage('address cannot be empty.').isString().withMessage('address must be a string.'),
    body('dob').notEmpty().withMessage('dob cannot be empty.').isDate().withMessage("dob must be a date."),
    body('designation').isEmpty().withMessage('designation cannot be empty.').isString().withMessage('designation must be a string.'),
    body('designation_type').isEmpty().withMessage('designation_type cannot be empty.').isString().withMessage('designation_type must be a string.'),
    body('joining_date').notEmpty().withMessage('joining_date cannot be empty.').isDate().withMessage("joining_date must be a date."),
    body('experience').notEmpty().withMessage('experience cannot be empty.').isNumeric().withMessage("experience must be an integer."),
    body('completed_projects').optional().notEmpty().withMessage('completed_projects cannot be empty.').isInt().withMessage("completed_projects must be an integer."),
    body('performance').optional().notEmpty().withMessage('performance cannot be empty.').isNumeric().withMessage("performance must be an integer."),
    body('teams').optional().notEmpty().withMessage('teams cannot be empty.').isInt().withMessage("teams must be an integer."),
    body('client_report').optional().notEmpty().withMessage('client_report cannot be empty.').isInt().withMessage("client_report must be an integer."),
]

export const userLogVal = [
    body('username').notEmpty().withMessage('username cannot be empty.'),
    body('password').notEmpty().withMessage('password cannot be empty.')
]

export const logOutVal = [
    param('id').notEmpty().withMessage('id cannot be empty.').isAlphanumeric().withMessage('id must be alphanumeric.')
]

export const upPassVal = [
    body('email').isEmail().withMessage('Invalid email input.').notEmpty().withMessage('Email cannot be empty.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password cannot be empty.').custom(passwordValidation),
    body('confirm_password').isLength({ min: 8 }).withMessage('confirm_Password must be at least 8 characters long').notEmpty().withMessage('confirm_Password cannot be empty.').custom(passwordValidation)
]