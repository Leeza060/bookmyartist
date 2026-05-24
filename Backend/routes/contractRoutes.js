const {
  createContract,
  clientSignContract,
  artistSignContract,
  getContract,
  getAllContracts,  
} = require("../controllers/contractController");

const router = require("express").Router();

router.post("/createcontract", createContract);

router.put("/clientsign/:contractId", clientSignContract);

router.put("/artistsign/:contractId", artistSignContract);

router.get("/contract/:contractId", getContract);
router.get("/contracts", getAllContracts);


module.exports = router;
