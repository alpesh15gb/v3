import { Router } from 'express';
import * as CompanyController from '../controllers/company.controller';

const router = Router();

// Companies
router.post('/companies', CompanyController.createCompany);
router.get('/companies', CompanyController.getAllCompanies);
router.get('/companies/:id', CompanyController.getCompanyById);
router.put('/companies/:id', CompanyController.updateCompany);
router.delete('/companies/:id', CompanyController.deleteCompany);

// Branches
import * as BranchController from '../controllers/branch.controller';
router.post('/branches', BranchController.createBranch);
router.get('/branches', BranchController.getAllBranches);
router.get('/branches/:id', BranchController.getBranchById);
router.put('/branches/:id', BranchController.updateBranch);
router.delete('/branches/:id', BranchController.deleteBranch);

// Locations
import * as LocationController from '../controllers/location.controller';
router.post('/locations', LocationController.createLocation);
router.get('/locations', LocationController.getAllLocations);
router.get('/locations/:id', LocationController.getLocationById);
router.put('/locations/:id', LocationController.updateLocation);
router.delete('/locations/:id', LocationController.deleteLocation);

// Departments
import * as DepartmentController from '../controllers/department.controller';
router.post('/departments', DepartmentController.createDepartment);
router.get('/departments', DepartmentController.getAllDepartments);
router.get('/departments/:id', DepartmentController.getDepartmentById);
router.put('/departments/:id', DepartmentController.updateDepartment);
router.delete('/departments/:id', DepartmentController.deleteDepartment);

// Designations
import * as DesignationController from '../controllers/designation.controller';
router.post('/designations', DesignationController.createDesignation);
router.get('/designations', DesignationController.getAllDesignations);
router.get('/designations/:id', DesignationController.getDesignationById);
router.put('/designations/:id', DesignationController.updateDesignation);
router.delete('/designations/:id', DesignationController.deleteDesignation);

export default router;
