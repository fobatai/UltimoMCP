# Ultimo API Schema Reference

Auto-generated from swagger.json. This documents all entity properties for the Ultimo REST API.

## Table of Contents

### Key Entities

- [Job](#job)
- [Equipment](#equipment)
- [WorkOrder](#workorder)
- [Purchase](#purchase)
- [PurchaseLine](#purchaseline)
- [PurchaseRequest](#purchaserequest)
- [Article](#article)
- [Employee](#employee)
- [Vendor](#vendor)
- [Cost](#cost)
- [ServiceContract](#servicecontract)
- [Incident](#incident)
- [PmWorkOrder](#pmworkorder)
- [Document](#document)
- [Permit](#permit)
- [SafetyIncident](#safetyincident)

### All Other Entities

- [Account](#account)
- [Aoc](#aoc)
- [ArticleGroup](#articlegroup)
- [ArticleSite](#articlesite)
- [ArticleSiteVendor](#articlesitevendor)
- [ArticleVendor](#articlevendor)
- [ArticleWarehouse](#articlewarehouse)
- [ArticleWarehouseLocation](#articlewarehouselocation)
- [Bodywork](#bodywork)
- [Building](#building)
- [BuildingFloor](#buildingfloor)
- [BuildingPart](#buildingpart)
- [CommunicationMedium](#communicationmedium)
- [ConditionFlaw](#conditionflaw)
- [ConditionFlawBook](#conditionflawbook)
- [ConditionFlawBookLine](#conditionflawbookline)
- [ConditionFlawMaterial](#conditionflawmaterial)
- [ConditionFlawPresent](#conditionflawpresent)
- [ConditionFlawType](#conditionflawtype)
- [ConditionInterest](#conditioninterest)
- [ConditionMeasurement](#conditionmeasurement)
- [ConditionRisk](#conditionrisk)
- [ConditionRiskPresent](#conditionriskpresent)
- [ConditionRiskScore](#conditionriskscore)
- [Consideration](#consideration)
- [ContractLineType](#contractlinetype)
- [CostCenter](#costcenter)
- [CostType](#costtype)
- [Craftsman](#craftsman)
- [Customer](#customer)
- [CustomerSatisfaction](#customersatisfaction)
- [Department](#department)
- [DocumentType](#documenttype)
- [EmployeeLabour](#employeelabour)
- [EmployeeLabourLine](#employeelabourline)
- [EquipmentFailType](#equipmentfailtype)
- [EquipmentMeasurementPoint](#equipmentmeasurementpoint)
- [EquipmentMeasurementPointValue](#equipmentmeasurementpointvalue)
- [EquipmentSparePart](#equipmentsparepart)
- [EquipmentType](#equipmenttype)
- [FailType](#failtype)
- [Feature](#feature)
- [Finishing](#finishing)
- [Frequency](#frequency)
- [Fuel](#fuel)
- [Gearing](#gearing)
- [IncidentCause](#incidentcause)
- [IncidentType](#incidenttype)
- [InspectionLine](#inspectionline)
- [InspectionPlan](#inspectionplan)
- [InspectionPlanLine](#inspectionplanline)
- [JobPlan](#jobplan)
- [JobPlanInspectionLine](#jobplaninspectionline)
- [JobProgressStatusHistory](#jobprogressstatushistory)
- [JobSchedulePart](#jobschedulepart)
- [JobWeekLabour](#jobweeklabour)
- [LendableObject](#lendableobject)
- [Location](#location)
- [MaintenanceClassification](#maintenanceclassification)
- [MaintenanceState](#maintenancestate)
- [Material](#material)
- [ObjectDocument](#objectdocument)
- [ObjectDowntime](#objectdowntime)
- [ObjectFeature](#objectfeature)
- [ObjectInspectionLine](#objectinspectionline)
- [ObjectRiskAnalysis](#objectriskanalysis)
- [PhysicalQuantity](#physicalquantity)
- [PhysicalQuantityUnit](#physicalquantityunit)
- [PmJob](#pmjob)
- [PmJobInspectionLine](#pmjobinspectionline)
- [Priority](#priority)
- [ProcessFunction](#processfunction)
- [ProductDossier](#productdossier)
- [ProgressStatus](#progressstatus)
- [Project](#project)
- [PurchaseRequestLine](#purchaserequestline)
- [Receipt](#receipt)
- [ReceiptLine](#receiptline)
- [Reservation](#reservation)
- [RiskClass](#riskclass)
- [RiskFactor](#riskfactor)
- [RiskFactorScore](#riskfactorscore)
- [SafetyIncidentFailType](#safetyincidentfailtype)
- [ServiceContractForm](#servicecontractform)
- [ServiceContractLine](#servicecontractline)
- [ServiceContractType](#servicecontracttype)
- [ShiftLog](#shiftlog)
- [ShiftLogbook](#shiftlogbook)
- [Site](#site)
- [SkillCategory](#skillcategory)
- [Space](#space)
- [TariffGroup](#tariffgroup)
- [Tool](#tool)
- [Unit](#unit)
- [Urgency](#urgency)
- [Vat](#vat)
- [VendorType](#vendortype)
- [Warehouse](#warehouse)
- [WarehouseLocation](#warehouselocation)
- [WorkOrderType](#workordertype)

---

---

## Job

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| StatusActiveDate | string (date-time) | Yes |  |  |
| StatusApprovedDate | string (date-time) | Yes |  |  |
| Canceled | boolean | No |  |  |
| StatusClosedDate | string (date-time) | Yes |  |  |
| StatusCompletedDate | string (date-time) | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| FailureDownDate | string (date-time) | Yes |  |  |
| DowntimeRequired | boolean | No |  |  |
| Duration | number (decimal) | No |  |  |
| DurationCalculated | number (decimal) | No |  |  |
| ExternalId | string | Yes |  | Yes |
| FeedbackText | string | Yes |  |  |
| FinalFinishDate | string (date) | Yes |  |  |
| StatusFinishedDate | string (date-time) | Yes |  |  |
| GeocodeX | number (decimal) | No |  |  |
| GeocodeY | number (decimal) | No |  |  |
| Hours | number (decimal) | No |  |  |
| HoursCalculated | number (decimal) | No |  |  |
| IsMaster | boolean | No |  |  |
| IsMultijob | boolean | No |  |  |
| LabourRealCost | number (decimal) | No |  |  |
| LabourChargedInternal | number (decimal) | No |  |  |
| MaterialsCalculated | number (decimal) | No |  |  |
| MaterialsRealCost | number (decimal) | No |  |  |
| MaterialsChargedInternal | number (decimal) | No |  |  |
| NoPermit | boolean | No |  |  |
| NumberOfMaterials | integer (int32) | No |  |  |
| StatusCreatedDate | string (date-time) | Yes |  |  |
| OperationLossHours | number (decimal) | No |  |  |
| OriginalFinalFinishDate | string (date) | Yes |  |  |
| OriginalScheduledStartDate | string (date) | Yes |  |  |
| PercentageComplete | number (decimal) | No |  |  |
| HoursPlanned | number (decimal) | No |  |  |
| StatusPostponedDate | string (date-time) | Yes |  |  |
| PurchaseRequestCalculated | number (decimal) | No |  |  |
| PurchaseRealCost | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ReleaseTillDate | string (date) | Yes |  |  |
| StatusCreatedReportDate | string (date-time) | Yes |  |  |
| Reporter | string | Yes |  |  |
| ReportText | string | Yes |  |  |
| StatusRequestedDate | string (date-time) | Yes |  |  |
| ScheduledStartDate | string (date-time) | Yes |  |  |
| StopRelated | boolean | No |  |  |
| TargetDate | string (date-time) | Yes |  |  |
| Text | string | Yes |  |  |
| ToolsCalculated | number (decimal) | No |  |  |
| ToolsRealCost | number (decimal) | No |  |  |
| ToolsChargedInternal | number (decimal) | No |  |  |
| TotalCost | number (decimal) | No |  |  |
| FailureUpDate | string (date-time) | Yes |  |  |
| ConditionFlawPresents | array | No |  |  |
| ConditionMeasurements | array | No |  |  |
| EmployeeLabourLines | array | No |  |  |
| CostComponent | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| Craftsman | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Customer | string | Yes |  |  |
| Department | string | Yes |  |  |
| Document | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| EquipmentType | string | Yes |  |  |
| FailType | string | Yes |  |  |
| HourTariffCategory | string | Yes |  |  |
| Incident | string | Yes |  |  |
| JobPlan | string | Yes |  |  |
| SubJobs | array | No |  |  |
| ParentJob | string | Yes |  |  |
| ChildJobs | array | No |  |  |
| PmWorkOrder | string | Yes |  |  |
| PmJob | object | Yes |  |  |
| ProductDossier | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Priority | string | Yes |  |  |
| Project | string | Yes |  |  |
| ProgressStatus | string | Yes |  |  |
| ReportForeignKeyEmployee | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Space | string | Yes |  |  |
| ScheduleParts | array | No |  |  |
| ServiceLevel | object | Yes |  |  |
| ServiceContract | string | Yes |  |  |
| Urgency | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| WorkOrderType | string | Yes |  |  |
| PurchaseLines | array | No |  |  |
| PurchaseRequestLines | array | No |  |  |
| Permits | array | No |  |  |
| ProgressStatusHistories | array | No |  |  |
| WeekLabs | array | No |  |  |

## Equipment

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Code | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| DepreciationDate | string (date) | Yes |  |  |
| Description | string | Yes |  |  |
| FuelTankCapacity | number (decimal) | No |  |  |
| GeocodeX | number (decimal) | No |  |  |
| GeocodeY | number (decimal) | No |  |  |
| InstallDate | string (date) | Yes |  |  |
| IPAddress | string | Yes |  |  |
| Location | string | Yes |  |  |
| TotalCost | number (decimal) | No |  |  |
| CostCurrentYear | number (decimal) | No |  |  |
| ManufactureYear | integer (int32) | No |  |  |
| Model | string | Yes |  |  |
| IndividualPM | boolean | No |  |  |
| NoPreventiveMaintenanceNeeded | boolean | No |  |  |
| PurchasePrice | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ReleaseDate | string (date) | Yes |  |  |
| ReleaseTillDate | string (date) | Yes |  |  |
| ReplacementCost | number (decimal) | No |  |  |
| ReplacementCostDate | string (date) | Yes |  |  |
| ReplacementDate | string (date) | Yes |  |  |
| ReplacementLife | integer (int32) | No |  |  |
| ReplacementYear | integer (int16) | No |  |  |
| RiskScore | number (decimal) | No |  |  |
| SerialNumber | string | Yes |  |  |
| TypeNumber | string | Yes |  |  |
| WarrantDate | string (date) | Yes |  |  |
| ConditionFlawPresents | array | No |  |  |
| ConditionFlawPresentParts | array | No |  |  |
| ConditionMeasurements | array | No |  |  |
| Aoc | string | Yes |  |  |
| Article | string | Yes |  |  |
| BuildingFloor | object | Yes |  |  |
| Building | string | Yes |  |  |
| BuildingPart | object | Yes |  |  |
| CostCenter | string | Yes |  |  |
| Department | string | Yes |  |  |
| EquipmentSubStatus | string | Yes |  |  |
| EquipmentType | string | Yes |  |  |
| Fuel | string | Yes |  |  |
| Gearing | string | Yes |  |  |
| GeoObject | string | Yes |  |  |
| Manufacturer | string | Yes |  |  |
| MaintenanceClassification | string | Yes |  |  |
| MaintenanceState | string | Yes |  |  |
| PartOfEquipment | string | Yes |  |  |
| Parts | array | No |  |  |
| PartOfMeter | string | Yes |  |  |
| Meters | array | No |  |  |
| ProductDossier | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| ProductionLine | string | Yes |  |  |
| ProgressStatus | string | Yes |  |  |
| RiskClass | string | Yes |  |  |
| ServiceVendor | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Space | string | Yes |  |  |
| TopOfEquipmentId | string | Yes |  | Yes |
| Vendor | string | Yes |  |  |
| InspectionLines | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| PmJobs | array | No |  |  |
| PmWorkOrders | array | No |  |  |
| EquipmentMeasurementPoints | array | No |  |  |
| SpareParts | array | No |  |  |

## WorkOrder

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| BudgetMutation | number (decimal) | No |  |  |
| BudgetOriginal | number (decimal) | No |  |  |
| BudgetTotal | number (decimal) | No |  |  |
| CalculationTotal | number (decimal) | No |  |  |
| CompleteTime | integer (int32) | No |  |  |
| Context | integer (int64) | No |  |  |
| CostTotal | number (decimal) | No |  |  |
| Description | string | Yes |  |  |
| Duration | number (decimal) | No |  |  |
| DurationCalculated | number (decimal) | No |  |  |
| Hours | number (decimal) | No |  |  |
| HoursCalculated | number (decimal) | No |  |  |
| HoursToPlan | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Reporter | string | Yes |  |  |
| TargetDate | string (date-time) | Yes |  |  |
| TotalHoursPlanned | number (decimal) | No |  |  |
| Jobs | array | No |  |  |
| Article | string | Yes |  |  |
| Building | string | Yes |  |  |
| Currency | string | Yes |  |  |
| Department | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| FailType | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Priority | string | Yes |  |  |
| Project | string | Yes |  |  |
| ProjectManagerEmployee | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Urgency | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| WorkOrderType | string | Yes |  |  |

## Purchase

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| NowInvoice | number (decimal) | No |  |  |
| NumberOfLines | integer (int32) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| Total | number (decimal) | No |  |  |
| CostCenter | string | Yes |  |  |
| Contact | string | Yes |  |  |
| Department | string | Yes |  |  |
| Job | string | Yes |  |  |
| Language | string | Yes |  |  |
| Site | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| Warehouse | string | Yes |  |  |
| Receipts | array | No |  |  |
| PurchaseLines | array | No |  |  |

## PurchaseLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Purchase | unknown | Yes |  |  |
| ArticleVendorPurchaseCode | string | Yes |  | Yes |
| BookCostOnServiceContract | boolean | No |  |  |
| CalculatedArticlePreparationQuantity | number (decimal) | No |  |  |
| CalculatedArticlePurchaseQuantity | number (decimal) | No |  |  |
| CalculatedArticleRepairQuantity | number (decimal) | No |  |  |
| CalculateDeliveryDate | boolean | No |  |  |
| Charge | boolean | No |  |  |
| Concept | integer (int16) | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Discount | number (decimal) | No |  |  |
| DeliveryDate | string (date) | Yes |  |  |
| GrossPrice | number (decimal) | No |  |  |
| GrossTotalPrice | number (decimal) | No |  |  |
| InvoicePrice | number (decimal) | No |  |  |
| InvoiceQuantity | number (decimal) | No |  |  |
| LeadTime | integer (int32) | No |  |  |
| Price | number (decimal) | No |  |  |
| PurchaseQuantity | number (decimal) | No |  |  |
| QuantityPurchaseUnit | number (decimal) | No |  |  |
| ReceivedQuantity | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Repair | boolean | No |  |  |
| Return | number (decimal) | No |  |  |
| StandardTotalCreditInvoicePriceIncludingVat | number (decimal) | No |  |  |
| StandardTotalCreditInvoicePrice | number (decimal) | No |  |  |
| StandardTotalCreditInvoiceQuantity | number (decimal) | No |  |  |
| StandardTotalInvoicePrice | number (decimal) | No |  |  |
| StandardTotalInvoicePriceIncludingVat | number (decimal) | No |  |  |
| StandardTotalPrice | number (decimal) | No |  |  |
| StandardTotalPriceIncludingVat | number (decimal) | No |  |  |
| StandardVatPrice | number (decimal) | No |  |  |
| StockArticle | boolean | No |  |  |
| Text | string | Yes |  |  |
| Tool | string | Yes |  |  |
| ToReceiveQuantity | number (decimal) | No |  |  |
| TotalPrice | number (decimal) | No |  |  |
| TotalPriceIncludingVat | number (decimal) | No |  |  |
| UnitDescription | string | Yes |  |  |
| VatPercentage | number (decimal) | No |  |  |
| VatPrice | number (decimal) | No |  |  |
| Costs | array | No |  |  |
| Account | string | Yes |  |  |
| Article | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| ChargeRaise | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Currency | string | Yes |  |  |
| Customer | string | Yes |  |  |
| Department | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| InvoiceLine | object | Yes |  |  |
| Job | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Project | string | Yes |  |  |
| ReceiptLine | object | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Vat | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| Warehouse | string | Yes |  |  |
| PurchaseRequestLines | array | No |  |  |

## PurchaseRequest

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Date | string (date) | Yes |  |  |
| Description | string | Yes |  |  |
| FinalReplyDate | string (date-time) | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RequestedDeliveryDate | string (date) | Yes |  |  |
| Text | string | Yes |  |  |
| TotalPrice | number (decimal) | No |  |  |
| CostCenter | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Department | string | Yes |  |  |
| Lines | array | No |  |  |
| RequestEmployee | string | Yes |  |  |
| Site | string | Yes |  |  |

## Article

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| AbcCode | string | Yes |  | Yes |
| Category | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| ApproveDate | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| JobsIssue | number (decimal) | No |  |  |
| LeadTime | integer (int16) | No |  |  |
| ArticleManufacturerArticleCode | string | Yes |  | Yes |
| MaximumStock | number (decimal) | No |  |  |
| MinimumStock | number (decimal) | No |  |  |
| MinimumPurchaseQuantity | number (decimal) | No |  |  |
| MinimumPurchaseUnit | number (decimal) | No |  |  |
| PurchaseLinePreparationQuantity | number (decimal) | No |  |  |
| PurchaseRequestLinePreparationQuantity | number (decimal) | No |  |  |
| Purchase | boolean | No |  |  |
| PurchasePreparationQuantity | number (decimal) | No |  |  |
| PurchaseLevel | number (decimal) | No |  |  |
| PurchasePrice | number (decimal) | No |  |  |
| PurchaseQuantity | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RegisterStock | boolean | No |  |  |
| ReservedQuantity | number (decimal) | No |  |  |
| ServingOutUnitDescription | string | Yes |  |  |
| ShowInWebShop | boolean | No |  |  |
| StockStatusCode | string | Yes |  | Yes |
| Stock | number (decimal) | No |  |  |
| Text | string | Yes |  |  |
| TypeNumber | string | Yes |  |  |
| UnitDescription | string | Yes |  |  |
| WarrantPeriod | integer (int32) | No |  |  |
| WarrantStartDate | string (date-time) | Yes |  |  |
| ArticleGroup | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Fuel | string | Yes |  |  |
| InventoryMethod | string | Yes |  |  |
| Manufacturer | string | Yes |  |  |
| ProductDossier | string | Yes |  |  |
| ReplacedByArticle | string | Yes |  |  |
| Site | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| ObjectDocuments | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| Vendors | array | No |  |  |
| ArticleWarehouses | array | No |  |  |
| EquipmentSpareParts | array | No |  |  |

## Employee

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| FirstName | string | Yes |  |  |
| Hours | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Surname | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| Craftsman | string | Yes |  |  |
| Department | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| JobPlans | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| ContactProcessFunctions | array | No |  |  |
| SkillCategories | array | No |  |  |
| LabourWeeks | array | No |  |  |

## Vendor

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| AddressLine1 | string | Yes |  |  |
| City | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| EmailAddress | string | Yes |  |  |
| FailurePhone | string | Yes |  |  |
| Phone | string | Yes |  |  |
| ProvinceStateRegion | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| Website | string | Yes |  |  |
| ZipCode | string | Yes |  | Yes |
| Documents | array | No |  |  |
| ManufacturedEquipments | array | No |  |  |
| Equipments | array | No |  |  |
| ManageProcessFunctions | array | No |  |  |
| ManufacturedProcessFunctions | array | No |  |  |
| ProcessFunctions | array | No |  |  |
| Country | string | Yes |  |  |
| Language | string | Yes |  |  |
| VendorType | string | Yes |  |  |

## Cost

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| StatusActiveDate | string (date-time) | Yes |  |  |
| BookDate | string (date) | Yes |  |  |
| CalculatedCost | number (decimal) | No |  |  |
| Context | integer (int64) | No |  |  |
| StatusCreatedDate | string (date-time) | Yes |  |  |
| Date | string (date) | Yes |  |  |
| StatusExpiredDate | string (date-time) | Yes |  |  |
| ExternalCost | number (decimal) | No |  |  |
| Hours | number (decimal) | No |  |  |
| InvoiceCost | number (decimal) | No |  |  |
| LabourCost | number (decimal) | No |  |  |
| MemorandumCost | number (decimal) | No |  |  |
| PurchaseCost | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ToolsCost | number (decimal) | No |  |  |
| WarehouseServeOutCost | number (decimal) | No |  |  |
| Account | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| StatusCreatedEmployee | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Department | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Job | string | Yes |  |  |
| MemorandumBookLine | object | Yes |  |  |
| PurchaseLine | object | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Project | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| ServiceContract | string | Yes |  |  |
| WarehouseServeOut | string | Yes |  |  |

## ServiceContract

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| ActiveDate | string (date-time) | Yes |  |  |
| Comment1 | string | Yes |  |  |
| Comment2 | string | Yes |  |  |
| Commences | string (date) | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Cost1 | number (decimal) | No |  |  |
| Cost2 | number (decimal) | No |  |  |
| CreateDate | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| EndDate | string (date) | Yes |  |  |
| Expires | string (date) | Yes |  |  |
| NumberOfVisits | number (decimal) | No |  |  |
| PurchaseCommitCurrentYear | number (decimal) | No |  |  |
| PurchaseCommitLastYear | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RenewalFrequencyCount | integer (int32) | No |  |  |
| ObjectCost | boolean | No |  |  |
| StartDate | string (date) | Yes |  |  |
| Text | string | Yes |  |  |
| Text1 | string | Yes |  |  |
| TotalInvoiced | number (decimal) | No |  |  |
| PurchaseContract | number (decimal) | No |  |  |
| PurchaseContractQuantity | number (decimal) | No |  |  |
| ObjectDocuments | array | No |  |  |
| CostCenter | string | Yes |  |  |
| Department | string | Yes |  |  |
| ManageDepartment | string | Yes |  |  |
| Manager | string | Yes |  |  |
| Owner | string | Yes |  |  |
| Site | string | Yes |  |  |
| Space | string | Yes |  |  |
| ServiceContractForm | string | Yes |  |  |
| ServiceContractType | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| Lines | array | No |  |  |

## Incident

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| CausedBy | integer (int16) | No |  |  |
| CityDescription | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Cost | number (decimal) | No |  |  |
| CostCalculated | number (decimal) | No |  |  |
| CostCalculatedCargoDamage | number (decimal) | No |  |  |
| CostCalculatedLoss | number (decimal) | No |  |  |
| CostCalculatedObjectDamage | number (decimal) | No |  |  |
| CostCalculatedReplacementVehicle | number (decimal) | No |  |  |
| CostCalculatedThirdPartySettlement | number (decimal) | No |  |  |
| CostCalculatedTowingAndSalvage | number (decimal) | No |  |  |
| CostLoss | number (decimal) | No |  |  |
| CountryDescription | string | Yes |  |  |
| Date | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| InvolvedParty | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ReportDate | string (date-time) | Yes |  |  |
| StreetDescription | string | Yes |  |  |
| Text1 | string | Yes |  |  |
| Text2 | string | Yes |  |  |
| Text3 | string | Yes |  |  |
| IncidentCause1 | string | Yes |  |  |
| IncidentCause2 | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| IncidentType | string | Yes |  |  |
| InvolvedEmployee | string | Yes |  |  |
| ReportEmployee | string | Yes |  |  |
| Site | string | Yes |  |  |

## PmWorkOrder

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| StatusApprovedDate | string (date-time) | Yes |  |  |
| AutoPmActive | boolean | No |  |  |
| AutoPmTimeUnitQuantity | integer (int16) | No |  |  |
| BelongsToSchema | boolean | No |  |  |
| Context | integer (int64) | No |  |  |
| ExecuteOnDayOccurrence | integer (int16) | No |  |  |
| Frequency | integer (int32) | No |  |  |
| DaysAWeek | integer (int16) | No |  |  |
| Description | string | Yes |  |  |
| LastMaintenanceDate | string (date) | Yes |  |  |
| ExecutionDays | integer (int32) | No |  |  |
| ExecutionPercentage | integer (int32) | No |  |  |
| TimeNextMaintenanceDate | string (date) | Yes |  |  |
| Dynamic | boolean | No |  |  |
| Hierarchy | integer (int16) | No |  |  |
| IsBulk | boolean | No |  |  |
| LastJobsGeneratedDate | string (date-time) | Yes |  |  |
| LastRunDate | string (date-time) | Yes |  |  |
| LastRunStatus | string | Yes |  |  |
| LastRunSuccess | boolean | No |  |  |
| LastRunSuccessDate | string (date-time) | Yes |  |  |
| ManualNextMaintenanceDate | string (date) | Yes |  |  |
| MarginAfterQuantity | integer (int16) | No |  |  |
| MarginBeforeQuantity | integer (int16) | No |  |  |
| MaterialsCalculated | number (decimal) | No |  |  |
| NextRunDate | string (date-time) | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| NextMaintenanceDate | string (date) | Yes |  |  |
| StopRelated | boolean | No |  |  |
| InspectionLines | array | No |  |  |
| Jobs | array | No |  |  |
| StatusApprovedEmployee | string | Yes |  |  |
| AutoPmTimeUnit | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Department | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| FrequencyPeriod | string | Yes |  |  |
| GroupPmWorkOrder | string | Yes |  |  |
| PmWorkOrdersInGroup | array | No |  |  |
| MarginAfterTimeUnit | string | Yes |  |  |
| MarginBeforeTimeUnit | string | Yes |  |  |
| MaintenanceClassification | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Priority | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Space | string | Yes |  |  |
| ExecuteOnDay | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| WorkOrderType | string | Yes |  |  |
| PmJobs | array | No |  |  |

## Document

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| CreateDate | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| FileMissing | boolean | No |  |  |
| FileName | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| CreateEmployee | string | Yes |  |  |
| DocumentType | string | Yes |  |  |
| FileSystemPath | string | Yes |  |  |
| ManageEmployee | string | Yes |  |  |
| Manufacturer | string | Yes |  |  |
| Site | string | Yes |  |  |
| Vendor | string | Yes |  |  |

## Permit

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Description | string | Yes |  |  |
| EndDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| InspectionLines | array | No |  |  |
| Department | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Job | string | Yes |  |  |
| Site | string | Yes |  |  |
| Space | string | Yes |  |  |

## SafetyIncident

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Absence | boolean | No |  |  |
| Context | integer (int64) | No |  |  |
| Date | string (date-time) | Yes |  |  |
| DaysAlternativeWork | number (decimal) | No |  |  |
| Description | string | Yes |  |  |
| FirstAid | boolean | No |  |  |
| Location | string | Yes |  |  |
| MaterialDamageText | string | Yes |  |  |
| MedicalTreatment | boolean | No |  |  |
| PossibleEffectsText | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ReportDirectCause | string | Yes |  |  |
| ReportText | string | Yes |  |  |
| Witnesses | string | Yes |  |  |
| Department | string | Yes |  |  |
| ProcessDirectCause | string | Yes |  |  |
| InitialObjectRiskAnalysis | string | Yes |  |  |
| ProgressStatus | string | Yes |  |  |
| Site | string | Yes |  |  |

## Account

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| ExternalId | string | Yes |  | Yes |
| InvoicedCurrentYear | number (decimal) | No |  |  |
| InvoicedLastYear | number (decimal) | No |  |  |
| MemorandumCostCurrentYear | number (decimal) | No |  |  |
| MemorandumCostLastYear | number (decimal) | No |  |  |
| PurchasedCurrentYear | number (decimal) | No |  |  |
| PurchasedLastYear | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Costs | array | No |  |  |
| Purchases | array | No |  |  |
| PurchaseLines | array | No |  |  |
| PurchaseRequests | array | No |  |  |
| PurchaseRequestLines | array | No |  |  |

## Aoc

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| DataProvider | string | Yes |  |  |
| Description | string | Yes |  |  |
| ExpectedMaxDepreciationLife | integer (int32) | No |  |  |
| ExpectedMinDepreciationLife | integer (int32) | No |  |  |
| Group | string | Yes |  |  |
| Level | integer (int16) | No |  |  |
| MainGroup | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Subgroup | string | Yes |  |  |
| DateOfLastOccurrence | string (date-time) | Yes |  |  |
| ValidFromDate | string (date) | Yes |  |  |
| PartOfAoc | string | Yes |  |  |
| Equipments | array | No |  |  |
| EquipmentTypes | array | No |  |  |

## ArticleGroup

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| AddToBillOfMaterials | boolean | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| CostType | string | Yes |  |  |
| Articles | array | No |  |  |
| InventoryMethod | string | Yes |  |  |

## ArticleSite

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Article | unknown | Yes |  |  |
| Id.Site | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| MaximumStock | number (decimal) | No |  |  |
| PurchaseLinePreparationQuantity | number (decimal) | No |  |  |
| PurchaseRequestLinePreparationQuantity | number (decimal) | No |  |  |
| PurchasePreparationQuantity | number (decimal) | No |  |  |
| PurchaseLevel | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ReservedQuantity | number (decimal) | No |  |  |
| StockStatusCode | string | Yes |  | Yes |
| Stock | number (decimal) | No |  |  |
| AbcCodeIdGenerated | string | Yes |  |  |
| AbcCodeId | string | Yes |  | Yes |
| Vendor | string | Yes |  |  |
| Vendors | array | No |  |  |

## ArticleSiteVendor

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.ArticleSite | unknown | Yes |  |  |
| Id.Vendor | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Discount | number (decimal) | No |  |  |
| LeadTime | integer (int32) | No |  |  |
| MinimumPurchaseQuantity | number (decimal) | No |  |  |
| Preference | boolean | No |  |  |
| PurchaseQuantityCeilSignificant | number (decimal) | No |  |  |
| QuantityPurchaseUnit | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| UnitDescription | string | Yes |  |  |

## ArticleVendor

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Article | unknown | Yes |  |  |
| Id.Vendor | unknown | Yes |  |  |
| ArticleUnitPrice | number (decimal) | No |  |  |
| ArticleUnitPriceDate | string (date) | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Discount | number (decimal) | No |  |  |
| LeadTime | integer (int32) | No |  |  |
| MinimumPurchaseQuantity | number (decimal) | No |  |  |
| Preference | boolean | No |  |  |
| PurchaseCode | string | Yes |  | Yes |
| PurchaseQuantityCeilSignificant | number (decimal) | No |  |  |
| QuantityPurchaseUnit | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| UnitDescription | string | Yes |  |  |
| Currency | string | Yes |  |  |

## ArticleWarehouse

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Article | unknown | Yes |  |  |
| Id.Warehouse | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| InPurchase | number (decimal) | No |  |  |
| JobMaterialWarehouse | boolean | No |  |  |
| MaximumStock | number (decimal) | No |  |  |
| PurchaseLinePreparationQuantity | number (decimal) | No |  |  |
| PurchaseRequestLinePreparationQuantity | number (decimal) | No |  |  |
| Purchase | boolean | No |  |  |
| PurchasePreparationQuantity | number (decimal) | No |  |  |
| PurchaseLevel | number (decimal) | No |  |  |
| PurchaseQuantity | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RepairQuantity | number (decimal) | No |  |  |
| ReservedQuantity | number (decimal) | No |  |  |
| StockStatusCode | string | Yes |  | Yes |
| Stock | number (decimal) | No |  |  |
| Site | string | Yes |  |  |

## ArticleWarehouseLocation

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Article | unknown | Yes |  |  |
| Id.WarehouseLocation | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| LastDateCounted | string (date-time) | Yes |  |  |
| NextCountDate | string (date) | Yes |  |  |
| QuantityAvailableForPickLists | number (decimal) | No |  |  |
| QuantityReservedForPickLists | number (decimal) | No |  |  |
| Quantity | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| AbcCodeId | string | Yes |  | Yes |

## Bodywork

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Building

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| GeocodeX | number (decimal) | No |  |  |
| GeocodeY | number (decimal) | No |  |  |
| ProvinceStateRegion | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ZipCode | string | Yes |  | Yes |
| BuildingType | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| Department | string | Yes |  |  |
| LongTermAsset | string | Yes |  |  |
| PartOfBuilding | string | Yes |  |  |
| ChildBuildings | array | No |  |  |
| ProcessFunction | string | Yes |  |  |
| Purpose | string | Yes |  |  |
| Site | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| ObjectFeatures | array | No |  |  |
| BuildingParts | array | No |  |  |

## BuildingFloor

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.BuildingPart | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Spaces | array | No |  |  |

## BuildingPart

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Building | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| BuildingFloors | array | No |  |  |

## CommunicationMedium

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## ConditionFlaw

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ConditionFlawBookLines | array | No |  |  |
| ConditionFlawType | string | Yes |  |  |
| ConditionInterest | string | Yes |  |  |
| ConditionFlawPresents | array | No |  |  |
| ConditionFlawMaterials | array | No |  |  |

## ConditionFlawBook

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Lines | array | No |  |  |

## ConditionFlawBookLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ConditionFlawBook | string | Yes |  |  |
| ConditionFlaw | string | Yes |  |  |

## ConditionFlawMaterial

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Material | unknown | Yes |  |  |
| Id.ConditionFlaw | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## ConditionFlawPresent

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Age | number (decimal) | No |  |  |
| Context | integer (int64) | No |  |  |
| Date | string (date) | Yes |  |  |
| Description | string | Yes |  |  |
| Lifetime | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Size | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| ConditionFlaw | string | Yes |  |  |
| ConditionMeasurement | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Job | string | Yes |  |  |
| Material | string | Yes |  |  |
| MaintenanceState | string | Yes |  |  |
| PartOfEquipment | string | Yes |  |  |
| PreviousConditionFlawPresent | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| SolveJob | string | Yes |  |  |
| ConditionRiskPresents | array | No |  |  |

## ConditionFlawType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |

## ConditionInterest

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| ConditionFlaws | array | No |  |  |

## ConditionMeasurement

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Inspected | boolean | No |  |  |
| NumberOfBuildingPartsInspected | integer (int16) | No |  |  |
| NumberOfBuildingPartsToInspect | integer (int16) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Remark | string | Yes |  |  |
| ConditionFlawPresents | array | No |  |  |
| Equipment | string | Yes |  |  |
| Job | string | Yes |  |  |
| MaintenanceState | string | Yes |  |  |
| PartOfConditionMeasurement | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |

## ConditionRisk

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## ConditionRiskPresent

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ConditionFlawPresent | string | Yes |  |  |
| ConditionRisk | string | Yes |  |  |
| ConditionRiskScore | string | Yes |  |  |

## ConditionRiskScore

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ConditionRiskPresents | array | No |  |  |

## Consideration

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| DataProvider | string | Yes |  |  |
| Description | string | Yes |  |  |
| Order | integer (int16) | No |  |  |
| ProviderMutationDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| TransferNextTime | boolean | No |  |  |

## ContractLineType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| TaxAdministrationCostCategory | string | Yes |  |  |
| TransferNextTime | boolean | No |  |  |
| CostCenter | string | Yes |  |  |
| CostType | string | Yes |  |  |

## CostCenter

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| AllowedPercentageExceeding | integer (int16) | No |  |  |
| BudgetForAllYears | number (decimal) | No |  |  |
| BudgetCurrentYear | number (decimal) | No |  |  |
| BudgetLastYear | number (decimal) | No |  |  |
| BudgetNextYear | number (decimal) | No |  |  |
| BudgetRemainingForAllYears | number (decimal) | No |  |  |
| BudgetRemainingCurrentYear | number (decimal) | No |  |  |
| BudgetRemainingLastYear | number (decimal) | No |  |  |
| BudgetRemainingNextYear | number (decimal) | No |  |  |
| ChildBudgetForAllYears | number (decimal) | No |  |  |
| ChildBudgetRemainingForAllYears | number (decimal) | No |  |  |
| ChildCostForAllYears | number (decimal) | No |  |  |
| Context | integer (int64) | No |  |  |
| CostForAllYears | number (decimal) | No |  |  |
| CostCurrentYear | number (decimal) | No |  |  |
| CostLastYear | number (decimal) | No |  |  |
| CostNextYear | number (decimal) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| SummarizedChildBudgetCurrentYear | number (decimal) | No |  |  |
| SummarizedChildBudgetLastYear | number (decimal) | No |  |  |
| SummarizedChildBudgetNextYear | number (decimal) | No |  |  |
| SummarizedChildBudgetRemainingCurrentYear | number (decimal) | No |  |  |
| SummarizedChildBudgetRemainingLastYear | number (decimal) | No |  |  |
| SummarizedChildBudgetRemainingNextYear | number (decimal) | No |  |  |
| SummarizedChildCostCurrentYear | number (decimal) | No |  |  |
| SummarizedChildCostLastYear | number (decimal) | No |  |  |
| SummarizedChildCostNextYear | number (decimal) | No |  |  |
| TotalBudgetForAllYears | number (decimal) | No |  |  |
| TotalBudgetCurrentYear | number (decimal) | No |  |  |
| TotalBudgetLastYear | number (decimal) | No |  |  |
| TotalBudgetNextYear | number (decimal) | No |  |  |
| TotalBudgetRemainingForAllYears | number (decimal) | No |  |  |
| TotalBudgetRemainingCurrentYear | number (decimal) | No |  |  |
| TotalBudgetRemainingLastYear | number (decimal) | No |  |  |
| TotalBudgetRemainingNextYear | number (decimal) | No |  |  |
| TotalCostForAllYears | number (decimal) | No |  |  |
| TotalCostCurrentYear | number (decimal) | No |  |  |
| TotalCostLastYear | number (decimal) | No |  |  |
| TotalCostNextYear | number (decimal) | No |  |  |
| Employee | string | Yes |  |  |
| PartOfCostCenter | string | Yes |  |  |
| Employees | array | No |  |  |
| Equipments | array | No |  |  |
| ProductDossiers | array | No |  |  |
| ServiceContracts | array | No |  |  |

## CostType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| PurchaseRequests | array | No |  |  |

## Craftsman

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| CalculationHourlyRate | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Employees | array | No |  |  |
| EmployeeLabourLines | array | No |  |  |
| Jobs | array | No |  |  |
| JobWeekLabours | array | No |  |  |
| PmJobs | array | No |  |  |

## Customer

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| CostCurrentYear | number (decimal) | No |  |  |
| CostLastYear | number (decimal) | No |  |  |
| Description | string | Yes |  |  |
| Status | integer (int32) | No |  |  |
| TotalCost | number (decimal) | No |  |  |
| Equipments | array | No |  |  |

## CustomerSatisfaction

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Rating | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Department

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| CostCurrentYear | number (decimal) | No |  |  |
| Description | string | Yes |  |  |
| Location | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| CostCenter | string | Yes |  |  |
| PartOfDepartment | string | Yes |  |  |
| ChildDepartments | array | No |  |  |
| Site | string | Yes |  |  |
| TopOfDepartmentId | string | Yes |  | Yes |
| Jobs | array | No |  |  |
| ProductDossiers | array | No |  |  |

## DocumentType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Documents | array | No |  |  |

## EmployeeLabour

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Employee | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Hours | number (decimal) | No |  |  |
| HoursFriday | number (decimal) | No |  |  |
| HoursMonday | number (decimal) | No |  |  |
| HoursSaturday | number (decimal) | No |  |  |
| HoursSunday | number (decimal) | No |  |  |
| HoursThursday | number (decimal) | No |  |  |
| HoursTuesday | number (decimal) | No |  |  |
| HoursWednesday | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| WeekStartDate | integer (int32) | No |  |  |
| Lines | array | No |  |  |

## EmployeeLabourLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.EmployeeLabour | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Hours | number (decimal) | No |  |  |
| HoursFriday | number (decimal) | No |  |  |
| HoursMonday | number (decimal) | No |  |  |
| HoursSaturday | number (decimal) | No |  |  |
| HoursSunday | number (decimal) | No |  |  |
| HoursThursday | number (decimal) | No |  |  |
| HoursTuesday | number (decimal) | No |  |  |
| HoursWednesday | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## EquipmentFailType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Equipment | unknown | Yes |  |  |
| Id.FailType | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## EquipmentMeasurementPoint

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Equipment | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| MinValue | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| MaxPmWorkOrder | string | Yes |  |  |
| MinPmWorkOrder | string | Yes |  |  |
| Values | array | No |  |  |

## EquipmentMeasurementPointValue

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.EquipmentMeasurementPoint | unknown | Yes |  |  |
| AbsoluteValue | boolean | No |  |  |
| Context | integer (int64) | No |  |  |
| Difference | number (decimal) | No |  |  |
| OriginalValue | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Value | number (decimal) | No |  |  |
| Employee | string | Yes |  |  |
| EquipmentPartOfEquipment | string | Yes |  |  |
| EquipmentProcessFunction | string | Yes |  |  |
| EquipmentSpace | string | Yes |  |  |

## EquipmentSparePart

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Equipment | unknown | Yes |  |  |
| Id.Article | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## EquipmentType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Equipments | array | No |  |  |
| Aoc | string | Yes |  |  |
| ObjectDocuments | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| ProcessFunctions | array | No |  |  |

## FailType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Jobs | array | No |  |  |

## Feature

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| PhysicalQuantityUnit | object | Yes |  |  |
| ObjectFeatures | array | No |  |  |

## Finishing

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Frequency

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Fuel

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Gearing

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## IncidentCause

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## IncidentType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## InspectionLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| FrequencyInterval | integer (int16) | No |  |  |
| LastDate | string (date) | Yes |  |  |
| NextDate | string (date) | Yes |  |  |
| Order | integer (int16) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Article | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Frequency | string | Yes |  |  |
| PmWorkOrder | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Space | string | Yes |  |  |

## InspectionPlan

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| CreateDate | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| EquipmentType | string | Yes |  |  |
| JobPlan | string | Yes |  |  |
| JobPlans | array | No |  |  |
| Lines | array | No |  |  |

## InspectionPlanLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.InspectionPlan | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| FrequencyInterval | integer (int16) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| Article | string | Yes |  |  |
| Frequency | string | Yes |  |  |

## JobPlan

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| DowntimeRequired | boolean | No |  |  |
| DurationCalculated | number (decimal) | No |  |  |
| Hours | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| Document | string | Yes |  |  |
| Employee | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| InspectionLines | array | No |  |  |

## JobPlanInspectionLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.JobPlan | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| NominalValue | string | Yes |  |  |
| Point | integer (int16) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| MeasureCode | string | Yes |  | Yes |

## JobProgressStatusHistory

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Job | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Date | string (date-time) | No |  |  |
| Hours | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Employee | string | Yes |  |  |
| HoursEmployee | string | Yes |  |  |
| NewProgressStatus | string | Yes |  |  |
| OldProgressStatus | string | Yes |  |  |

## JobSchedulePart

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| EndDate | string (date-time) | Yes |  |  |
| HoursCalculated | number (decimal) | No |  |  |
| PlanDate | string (date) | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Remark | string | Yes |  |  |
| StartDate | string (date-time) | Yes |  |  |
| Employee | string | Yes |  |  |
| Job | string | Yes |  |  |
| JobResource | object | Yes |  |  |
| PartOfJobSchedulePart | string | Yes |  |  |
| Vendor | string | Yes |  |  |

## JobWeekLabour

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| BookDate | string (date) | Yes |  |  |
| ChargeTariff | number (decimal) | No |  |  |
| Context | integer (int64) | No |  |  |
| Cost | number (decimal) | No |  |  |
| Hours | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| CostCenter | string | Yes |  |  |
| Craftsman | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Day | string | Yes |  |  |
| Department | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| HourTariffCategory | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Project | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |

## LendableObject

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| AvailableQuantity | number (decimal) | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| TotalQuantity | number (decimal) | No |  |  |
| Type | string | Yes |  |  |

## Location

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| PartOfLocation | string | Yes |  |  |
| Warehouse | string | Yes |  |  |

## MaintenanceClassification

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RiskScore | number (decimal) | No |  |  |
| EquipmentType | string | Yes |  |  |
| RiskClass | string | Yes |  |  |

## MaintenanceState

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| ConditionScore | integer (int32) | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| EndPercentage | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| SortSequence | string | Yes |  |  |
| StartPercentage | number (decimal) | No |  |  |
| Text | string | Yes |  |  |
| ConditionFlawPresents | array | No |  |  |
| AppearanceConditionMeasurements | array | No |  |  |
| InspectorConditionMeasurements | array | No |  |  |
| ConditionMeasurements | array | No |  |  |
| CurrentAppearanceEquipments | array | No |  |  |
| CurrentEquipments | array | No |  |  |
| WantedEquipments | array | No |  |  |
| CurrentProcessFunctions | array | No |  |  |
| WantedProcessFunctions | array | No |  |  |

## Material

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ConditionFlawPresents | array | No |  |  |
| ConditionFlawMaterials | array | No |  |  |

## ObjectDocument

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| CreateDate | string (date-time) | Yes |  |  |
| DataProvider | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Replaced | boolean | No |  |  |
| Text | string | Yes |  |  |
| Article | string | Yes |  |  |
| BuildingFloor | object | Yes |  |  |
| Building | string | Yes |  |  |
| CreateEmployee | string | Yes |  |  |
| Document | string | Yes |  |  |
| Email | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| EquipmentType | string | Yes |  |  |
| Incident | string | Yes |  |  |
| Invoice | string | Yes |  |  |
| Job | string | Yes |  |  |
| JobPlan | string | Yes |  |  |
| Purchase | string | Yes |  |  |
| Permit | string | Yes |  |  |
| PmJob | object | Yes |  |  |
| ProductDossier | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Project | string | Yes |  |  |
| Receipt | string | Yes |  |  |
| SafetyIncident | string | Yes |  |  |
| Space | string | Yes |  |  |
| Service | string | Yes |  |  |
| ServiceContract | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| WorkOrder | string | Yes |  |  |

## ObjectDowntime

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| ProductionLoss | number (decimal) | No |  |  |
| ProductionLossPerHour | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | No |  |  |
| Status | integer (int32) | No |  |  |
| CostCenter | string | Yes |  |  |
| Department | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Job | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |

## ObjectFeature

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| AlphanumericValue | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| NumericValue | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ArticleGroup | string | Yes |  |  |
| Article | string | Yes |  |  |
| Building | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| EquipmentType | string | Yes |  |  |
| FeatureChoice | object | Yes |  |  |
| Feature | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Project | string | Yes |  |  |

## ObjectInspectionLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Applicable | boolean | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RemarkText | string | Yes |  |  |
| Jobs | array | No |  |  |

## ObjectRiskAnalysis

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RemarkText | string | Yes |  |  |
| RiskClassDescription | string | Yes |  |  |
| RiskClassRemarkText | string | Yes |  |  |
| RiskScore | number (decimal) | No |  |  |
| RiskProbabilityDescription | string | Yes |  |  |
| RiskProbabilityScore | number (decimal) | No |  |  |
| RiskClass | string | Yes |  |  |
| SafetyIncident | string | Yes |  |  |

## PhysicalQuantity

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## PhysicalQuantityUnit

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.PhysicalQuantity | unknown | Yes |  |  |
| Id.Unit | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## PmJob

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.PmWorkOrder | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| DowntimeRequired | boolean | No |  |  |
| DurationCalculated | number (decimal) | No |  |  |
| Hours | number (decimal) | No |  |  |
| NoPermit | boolean | No |  |  |
| PlannedHours | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| StopRelated | boolean | No |  |  |
| Text | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| Craftsman | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Department | string | Yes |  |  |
| Document | string | Yes |  |  |
| Employee | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| JobPlan | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Priority | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Space | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| WorkOrderType | string | Yes |  |  |
| InspectionLines | array | No |  |  |

## PmJobInspectionLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.PmJob | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| NominalValue | string | Yes |  |  |
| Point | integer (int16) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| MeasureCode | string | Yes |  | Yes |

## Priority

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| DurationUntilScheduledStartDate | number (decimal) | No |  |  |
| DurationUntilTargetDate | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Jobs | array | No |  |  |
| PmJobs | array | No |  |  |
| PmWorkOrders | array | No |  |  |
| Projects | array | No |  |  |
| WorkOrders | array | No |  |  |

## ProcessFunction

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Code | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Critical | boolean | No |  |  |
| CurrentMaintenanceStateDate | string (date) | Yes |  |  |
| Description | string | Yes |  |  |
| GeocodeX | number (decimal) | No |  |  |
| GeocodeY | number (decimal) | No |  |  |
| InstallDate | string (date) | Yes |  |  |
| LastPmMaintenanceDate | string (date) | Yes |  |  |
| LocationDescription | string | Yes |  |  |
| ManufactureYear | integer (int32) | No |  |  |
| Model | string | Yes |  |  |
| NextPmMaintenanceDate | string (date) | Yes |  |  |
| PurchasePrice | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RiskScore | number (decimal) | No |  |  |
| SerialNumber | string | Yes |  |  |
| SetupDate | string (date-time) | Yes |  |  |
| ConditionFlawPresents | array | No |  |  |
| ConditionMeasurements | array | No |  |  |
| Equipments | array | No |  |  |
| InspectionLines | array | No |  |  |
| Jobs | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| PmWorkOrders | array | No |  |  |
| CostCenter | string | Yes |  |  |
| CurrentMaintenanceState | string | Yes |  |  |
| Department | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| EquipmentType | string | Yes |  |  |
| GeoObject | string | Yes |  |  |
| LastPmModel | string | Yes |  |  |
| Location | string | Yes |  |  |
| Manufacturer | string | Yes |  |  |
| NextPmMaintenanceJob | string | Yes |  |  |
| PartOfProcessFunction | string | Yes |  |  |
| ProductionLine | string | Yes |  |  |
| RiskClass | string | Yes |  |  |
| Site | string | Yes |  |  |
| Space | string | Yes |  |  |
| TopOfProcessFunctionId | string | Yes |  | Yes |
| TopOfProcessFunctionWithinSameContext | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| WorkOrders | array | No |  |  |

## ProductDossier

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ObjectDocuments | array | No |  |  |
| InspectionLines | array | No |  |  |

## ProgressStatus

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| HoursAreMandatory | boolean | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Project

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| CostTotal | number (decimal) | No |  |  |
| Description | string | Yes |  |  |
| Hours | number (decimal) | No |  |  |
| HoursCalculated | number (decimal) | No |  |  |
| HoursChargedInternal | number (decimal) | No |  |  |
| HoursToPlan | number (decimal) | No |  |  |
| MaterialsCalculated | number (decimal) | No |  |  |
| PercentageComplete | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ResourcesCalculated | number (decimal) | No |  |  |
| DurationCalculated | number (decimal) | No |  |  |
| ScheduledFinishDate | string (date-time) | Yes |  |  |
| ScheduledStartDate | string (date-time) | Yes |  |  |
| ToolsCalculated | number (decimal) | No |  |  |
| ToolsRealCost | number (decimal) | No |  |  |
| ToolsChargedInternal | number (decimal) | No |  |  |
| TotalHoursPlanned | number (decimal) | No |  |  |
| Jobs | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| PurchaseLines | array | No |  |  |
| PurchaseRequestLines | array | No |  |  |
| CostCenter | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Manager | string | Yes |  |  |
| Priority | string | Yes |  |  |
| WorkOrders | array | No |  |  |

## PurchaseRequestLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| ArticleVendorPurchaseCode | string | Yes |  | Yes |
| BookDate | string (date) | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Discount | number (decimal) | No |  |  |
| GrossPrice | number (decimal) | No |  |  |
| GrossTotalPrice | number (decimal) | No |  |  |
| InvoiceCost | number (decimal) | No |  |  |
| InvoiceQuantity | number (decimal) | No |  |  |
| JobSelected | boolean | No |  |  |
| LeadTime | integer (int32) | No |  |  |
| Price | number (decimal) | No |  |  |
| Purchase | boolean | No |  |  |
| PurchaseQuantity | number (decimal) | No |  |  |
| QuantityPurchaseUnit | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Repair | boolean | No |  |  |
| RequestedDeliveryDate | string (date) | Yes |  |  |
| StandardTotalPrice | number (decimal) | No |  |  |
| StockArticle | boolean | No |  |  |
| Text | string | Yes |  |  |
| ToDeliverQuantity | number (decimal) | No |  |  |
| TotalPrice | number (decimal) | No |  |  |
| UnitDescription | string | Yes |  |  |
| Article | string | Yes |  |  |
| CostCenter | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Currency | string | Yes |  |  |
| Customer | string | Yes |  |  |
| Department | string | Yes |  |  |
| Equipment | string | Yes |  |  |
| Job | string | Yes |  |  |
| JobPlan | string | Yes |  |  |
| PurchaseLine | object | Yes |  |  |
| PurchaseRequest | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Project | string | Yes |  |  |
| RequestEmployee | string | Yes |  |  |
| Site | string | Yes |  |  |
| SkillCategory | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| Warehouse | string | Yes |  |  |

## Receipt

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Date | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Currency | string | Yes |  |  |
| Purchase | string | Yes |  |  |
| Site | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| Warehouse | string | Yes |  |  |
| Lines | array | No |  |  |

## ReceiptLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Receipt | unknown | Yes |  |  |
| VendorPurchaseCode | string | Yes |  | Yes |
| Context | integer (int64) | No |  |  |
| DataProvider | string | Yes |  |  |
| Price | number (decimal) | No |  |  |
| ProviderMutationDate | string (date-time) | Yes |  |  |
| ReceivedQuantity | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| ReturnedQuantity | number (decimal) | No |  |  |
| ReturnedToReceiveQuantity | number (decimal) | No |  |  |
| PurchaseLines | array | No |  |  |
| Article | string | Yes |  |  |
| PurchaseLine | object | Yes |  |  |

## Reservation

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| StatusCreatedDate | string (date-time) | Yes |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| CostCenter | string | Yes |  |  |
| CostType | string | Yes |  |  |
| Customer | string | Yes |  |  |
| Department | string | Yes |  |  |
| Site | string | Yes |  |  |

## RiskClass

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Color | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| FromScore | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| RemarkText | string | Yes |  |  |
| TillScore | number (decimal) | No |  |  |
| MaintenanceClassifications | array | No |  |  |
| ProductDossiers | array | No |  |  |

## RiskFactor

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| RiskFactorScores | array | No |  |  |

## RiskFactorScore

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.RiskFactor | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Score | number (decimal) | No |  |  |
| Text | string | Yes |  |  |

## SafetyIncidentFailType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.SafetyIncident | unknown | Yes |  |  |
| Id.FailType | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## ServiceContractForm

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## ServiceContractLine

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.ServiceContract | unknown | Yes |  |  |
| ArticleUnitPrice | number (decimal) | No |  |  |
| Context | integer (int64) | No |  |  |
| Invoiced | number (decimal) | No |  |  |
| InvoicedQuantity | number (decimal) | No |  |  |
| LeadTime | integer (int32) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Text | string | Yes |  |  |
| PurchaseLines | array | No |  |  |
| PurchaseRequestLines | array | No |  |  |
| ArticleGroup | string | Yes |  |  |
| Article | string | Yes |  |  |
| Craftsman | string | Yes |  |  |
| Vendor | string | Yes |  |  |

## ServiceContractType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## ShiftLog

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| StartDate | string (date) | Yes |  |  |
| Employee | string | Yes |  |  |
| ShiftLogbook | string | Yes |  |  |
| Site | string | Yes |  |  |

## ShiftLogbook

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Department | string | Yes |  |  |
| ProcessFunction | string | Yes |  |  |
| Site | string | Yes |  |  |
| Logs | array | No |  |  |

## Site

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| City | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Departments | array | No |  |  |
| ProductDossiers | array | No |  |  |
| Country | string | Yes |  |  |
| PartOfSite | string | Yes |  |  |
| SiteType | string | Yes |  |  |
| ServiceContracts | array | No |  |  |

## SkillCategory

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Hours | number (decimal) | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| CostCenter | string | Yes |  |  |
| Manager | string | Yes |  |  |

## Space

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Employees | array | No |  |  |
| Equipments | array | No |  |  |
| ObjectFeatures | array | No |  |  |
| BuildingFloor | object | Yes |  |  |
| CostCenter | string | Yes |  |  |
| Department | string | Yes |  |  |
| Site | string | Yes |  |  |
| Vendor | string | Yes |  |  |
| Zone | string | Yes |  |  |

## TariffGroup

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Tool

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Quantity | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Unit

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Symbol | string | Yes |  |  |

## Urgency

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Vat

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Percentage | number (decimal) | No |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## VendorType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## Warehouse

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| Locations | array | No |  |  |
| Site | string | Yes |  |  |
| ArticleWarehouses | array | No |  |  |

## WarehouseLocation

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | object | No |  |  |
| Id.Warehouse | unknown | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Dynamic | boolean | No |  |  |
| MultipleArticlesAllowed | boolean | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |

## WorkOrderType

| Property | Type | Nullable | Enum | FK Reference |
|----------|------|----------|------|-------------|
| Id | string | No |  |  |
| Category | string | Yes |  |  |
| Context | integer (int64) | No |  |  |
| Description | string | Yes |  |  |
| Description2 | string | Yes |  |  |
| MTAcceptanceTest | boolean | No |  |  |
| MTCorrectiveMaintenance | boolean | No |  |  |
| MTElectricalTest | boolean | No |  |  |
| MTFunctionalTest | boolean | No |  |  |
| MTPreviousInspection | boolean | No |  |  |
| MTPreviousMaintenance | boolean | No |  |  |
| RecordChangeDate | string (date-time) | Yes |  |  |
| RecordCreateDate | string (date-time) | Yes |  |  |
| Status | integer (int32) | No |  |  |
| HourCode | string | Yes |  | Yes |

---

## Summary Statistics

- **Total schemas in swagger**: 117 (including error)
- **Entity schemas**: 116
- **Key entities documented**: 16

### Property Counts (Key Entities)

| Entity | Properties |
|--------|-----------|
| Job | 97 |
| Equipment | 71 |
| WorkOrder | 36 |
| Purchase | 20 |
| PurchaseLine | 66 |
| PurchaseRequest | 17 |
| Article | 48 |
| Employee | 20 |
| Vendor | 24 |
| Cost | 34 |
| ServiceContract | 38 |
| Incident | 33 |
| PmWorkOrder | 56 |
| Document | 17 |
| Permit | 10 |
| SafetyIncident | 22 |

