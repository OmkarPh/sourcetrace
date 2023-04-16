import { humidityToUnits, temperatureToUnits } from "../../utils/general";

interface AccountKeys {
  pk: string;
  address: string;
  name: string;
  reg_no: string;
  phone: number;
}
interface LotInfo {
  productId: number;
  lot_size: number;
  tempUnits: number;
  humidityUnits: number;
  checkpoints?: {
    warehouse: WarehouseDetails;
    in: {
      tempUnits: number;
      humidityUnits: number;
    },
    out: {
      tempUnits: number;
      humidityUnits: number;
    },
  }[];
}
interface ProducerDetails extends AccountKeys {
  physicalAddress: string;
  products: {
    name: string;
    price: number;
    temperature: { min: number; max: number };
    timeLimit?: { min: number; max: number };
    humidity: { min: number; max: number };
    producer_name: string;
    image?: string;
    lots?: LotInfo[];
  }[];
  trucks?: {
    truckLicensPlate: string; // eg. "MH 06 EF 3259"
    pk: string;
    address: string;
  }[];
}
interface WarehouseDetails extends AccountKeys {
  physicalAddress: string;
  certifications: { title: string; url: string }[];
  isRetailer?: boolean;
  trucks?: {
    truckLicensPlate: string; // eg. "MH 06 EF 3259"
    pk: string;
    address: string;
  }[];
}


export const warehouseAccounts: { [key: string]: WarehouseDetails } = {
  antophyll: {
    pk: "50df0b6a495e75aaa31f04f27bffdc380772b483d41a4826b7c854f434e086dd",
    address: "0x1FCC6B2778417cf0eD82f6e45f2be015f0742ECa",
    name: "Antophyll warehousing complex ltd.",
    reg_no: "3antophy4789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Dosti Acres, Antop Hill, Wadala west, Mumbai, Maharashtra 400037",
    certifications: [],
    trucks: [
      {
        truckLicensPlate: "MH 02 DD 5221",
        pk: "0x881f120226ddaeae82de42942d68e36b37ec08c78fe10c476d68e65e296a7b27",
        address: "0x869B57623A44F62ABc43ce67097C3Ac1c8C31eBc",
      },
      {
        truckLicensPlate: "MH 08 HH 4773",
        pk: "0x445539af0ce3f3bf64c5f37f1d1b389de2ded9790a136143507e87df56213308",
        address: "0xf51510412594CDc96c270b880F1dE75105B29900",
      },
    ],
  },
  eskimo: {
    pk: "f506511bdee935fd4e030c423edc51905b0f2b3956bb7be07ab3f7c05df1a65c",
    address: "0xD766DF5CcD4F7C73e0d2dc4d9f9a32616fdD7400",
    name: "Eskimo cold distribution",
    reg_no: "eskimo4789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Bindal Industrial Estate, Sakinaka Tel. Exchange Lane, Andheri E, Maharashtra 400072",
    certifications: [
      {
        title: "Pollution control board certificate",
        url: "https://img.yumpu.com/17979570/1/500x640/part-2-maharashtra-pollution-control-board.jpg",
      },
    ],
    trucks: [
      {
        truckLicensPlate: "MH 08 CF 9299",
        pk: "0x30617f4a927340046255555e9cc161635dfe19464b0ba433649a762afeadd9e7",
        address: "0x31C8aA1bCE09ecD845f8423604662a7Da4Bff9D2",
      },
    ],
  },
  welspun: {
    pk: "1d009ea92c976fd7db91281fc00f194e108daf4673f4be1d52389cfa2e6ae9d5",
    address: "0xB72bcAA4ecCD4fED4CB92f890be6d1ed0eC6cc08",
    name: "Welspun One logistics solution.",
    reg_no: "3welspun89392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Kamala Mills Compound, Welspun House, Lower Parel, Mumbai, Maharashtra 400013",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
    trucks: [
      {
        truckLicensPlate: "MH 02 DD 5221",
        pk: "0x881f120226ddaeae82de42942d68e36b37ec08c78fe10c476d68e65e296a7b27",
        address: "0x869B57623A44F62ABc43ce67097C3Ac1c8C31eBc",
      },
      {
        truckLicensPlate: "MH 08 HH 4773",
        pk: "0x445539af0ce3f3bf64c5f37f1d1b389de2ded9790a136143507e87df56213308",
        address: "0xf51510412594CDc96c270b880F1dE75105B29900",
      },
    ],
  },

  Mayur: {
    pk: "0x2915815ca28378567fe95cc891184e9087bf5fe7f1f2314e13e85fa575b9b074",
    address: "0x06aaB32BCE950C8e0Fc5967b6E3dC13F7Bd23873",
    name: "Mayur Cold Storage",
    physicalAddress:
      "D/345, M I D C, Tic Turbhe Naka, near Gulam Hotel, Mumbai, Maharashtra 400613",
    reg_no: "Mayur89392@$WE323S@#@#42",
    phone: 9032328423,

    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Sandfoods: {
    pk: "0x1d2e72e08a56075fe9596b5485435c8324dd473e741a09033844fbd9b44ddd28",
    address: "0x20E079251b71348aE836A3494C7584e0F6F4DcB6",
    name: "Sanfoods & Cold Storage Pvt Ltd",
    reg_no: "Sandfoos789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "TTC Midc Rd, T.T.C. Industrial Area, Sector 2, Pawne, Navi Mumbai, Maharashtra 400705",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Vishal: {
    pk: "0x6d096760f52fde8a1ac190fe6f814ae2f542ee2d524b04e3086be2552d88f5be",
    address: "0x0406988DB73208E58E83742B953E58cC615905E6",
    name: "Vishal Ice Factory And Cold Storage",
    reg_no: "Vishal89392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Door No.D- 25/10 T. T. C M. I. D. C Industrial Area Opposite H. P Petrol Pump M. I. D. C Kulshet, Thane - Belapur Rd, Turbhe, Navi Mumbai, Maharashtra 400705",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Polar: {
    pk: "0xf593a509cd329d14bfd059b30a3decdc4fa592a16a7b7a6b50741c4212e77dcf",
    address: "0x8103DA568Ff56A64DC5BdCab18F8e19430A49938",
    name: "Dot Cold Storage Whole Sale & Retail",
    reg_no: "Polar4789392@$WE323S@#@#42",
    phone: 9032343423,
    physicalAddress:
      " Bajaj Arcade, Khar, Danda, Pali Hill, Mumbai, Maharashtra 400052",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  StowNest: {
    pk: "0xdc029297d5ad602618f70a8c5f1b04c7e7575cac239455726a45050197241030",
    address: "0x2b109B932025E1E9f8fB1f01e8DAf36A3000b046",
    name: "StowNest Storage",
    reg_no: "StowNest789392@$WE323S@#@#42",
    phone: 8832328423,
    physicalAddress: " Prestige, Augusta Rd, Bengaluru, Karnataka 562149",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Dels: {
    pk: "0x575369a3dee3badf77eee52bfbb497f5ff601dd97d5f6ad96bbb9260073c5af3",
    address: "0x26509815B0eD67D7616B2DCb63dBcd3bE492DdFc",
    name: "Del's Food",
    reg_no: "Dels89392@$WE323S@#@#42",
    phone: 9422328423,
    physicalAddress:
      " Shop No. 3, Sahar Village, Andheri East, Mumbai, Maharashtra 400099",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Tanvi: {
    pk: "0x7aa4e5df42fcf8d010782deada2b5e7d3ae7cf501f717ed529c2db1b169cc483",
    address: "0x9282262A05bb316641530a57C80d487226143445",
    name: "Tanvi Food Tech private Limited",
    reg_no: "3Tanvi789392@$WE323S@#@#42",
    phone: 8732328423,
    physicalAddress: "Rohisa, Gujarat 364295",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Jsun: {
    pk: "0x1d001ceac7ae186e88335f6f098192d45c17c2c92ba4c2db91ec088fa1a35643",
    address: "0x718A12082AA6264e256C8949eD76BDED530b959a",
    name: "Jsun Foods Pvt Ltd",
    reg_no: "Jsun789392@$WE323S@#@#42",
    phone: 7832328423,
    physicalAddress:
      "plot no 246, Jawahar Co-op Ind, Kamothe, Panvel, Navi Mumbai,",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  FCI: {
    pk: "0x549970941e1b601c605b87db6d3dc475c6f485fc13086725543eae21b4ddef10",
    address: "0x83d031865D44da0A59CA13D680609d7c53538BBC",
    name: "FCI FOOD STORAGE",
    reg_no: "FCI9392@$WE323S@#@#42",
    phone: 9432328423,

    physicalAddress: "FMWG+9FH, Adra, West Bengal 723121",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Arihant: {
    pk: "0xc2d3c4f63604af4df6bd17cd12a1e55e4b46acf6721e1c54dbcccf6bf4cc9236",
    address: "0x8C0Deb43C1Fb6329ad2c3fBBaD57b184d1F539F3",
    name: "Arihant Industries",
    reg_no: "Arihant89392323S@#@#42",
    phone: 893232423,

    physicalAddress:
      "C-53, Pocket C, Okhla I, Okhla Industrial Estate, New Delhi, Delhi 110020",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Mountain: {
    pk: "0xe5ad3ff4e6530131fdb6af7d86820a79e65e94af557ae57f968e827611877594",
    address: "0xa8B5115dFe82fDd28Dd6EfD8662EA40899E85BDA",
    name: "   Mountain Trail Foods Pvt Ltd. Warehouse Bamnoli Vill",
    reg_no: "Mountain789392323S@#@#42",
    phone: 863232423,
    physicalAddress:
      "plot no 95, Water wood cold chain solution, Bamnoli, Sector 28 Dwarka, Dwarka, Delhi, 110061",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
  Grofers: {
    pk: "0x8d2a005771dc75891ced998851114d53cc21295364f3d8b7f6c3e70c146d15b9",
    address: "0xF3F7834fFA6d74eBbA17887dc5aB81fb261e3BF3",
    name: "   Grofers India Pvt Ltd ",
    reg_no: "Grofers*3S@#@#42",
    phone: 993232092,
    physicalAddress:
      "Rangpuri Extention B-Block Pocket-4, Near Bangali colony and Shiv Shakti Public School, New Delhi, Delhi 110037",
    certifications: [
      {
        title: "FSSAI Basic License",
        url: "",
      },
    ],
  },
};


export const producerAccounts: { [key: string]: ProducerDetails } = {
  nestle: {
    pk: "0fd9949357465ea9dc776d416fafe782772ef27baad8abdb4e5e64323b0618cc",
    address: "0xabd8EeD5b630578F72eEB06c637dB7179576A811",
    name: "Nestle India Ltd.",
    physicalAddress:
      "ICC Chambers, Marol, Andheri East, Mumbai, Maharashtra 400072",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    products: [
      {
        name: "Nestle Kitkat",
        price: 400,
        temperature: { min: -10, max: 20 },
        humidity: { min: 15, max: 75 },
        timeLimit: { min: 0, max: 1440 }, // 24 hour (i.e. 24 minute)
        producer_name: "Nestle Pvt Ltd",
        image:
          "https://res.cloudinary.com/dp0ayty6p/image/upload/v1679820531/kitkat_rmwi0o.jpg",
        lots: [
          {
            humidityUnits: humidityToUnits(55),
            tempUnits: temperatureToUnits(13),
            lot_size: 100,
            productId: 0,
            checkpoints: [
              {
                warehouse: warehouseAccounts.antophyll,
                in: {
                  humidityUnits: humidityToUnits(65),
                  tempUnits: temperatureToUnits(12),
                },
                out: {
                  humidityUnits: humidityToUnits(67),
                  tempUnits: temperatureToUnits(14),
                },
              },
              {
                warehouse: warehouseAccounts.eskimo,
                in: {
                  humidityUnits: humidityToUnits(84),
                  tempUnits: temperatureToUnits(25),
                },
                out: {
                  humidityUnits: humidityToUnits(57),
                  tempUnits: temperatureToUnits(14),
                },
              }
            ],
          },
        ],
      },
      {
        name: "Real dairy icecream",
        price: 150,
        temperature: { min: -10, max: 20 },
        timeLimit: { min: 0, max: 600 }, // 10 hour (i.e. 10 minutes)
        humidity: { min: 25, max: 70 },
        producer_name: "Nestle Pvt Ltd",
        image:
          "https://res.cloudinary.com/dp0ayty6p/image/upload/v1680854027/Non-dairy-ice-cream-alternatives-from-coconut-and-almond-to-open-up-new-opportunities-for-industry-growth_l67d9m.jpg",
        lots: [
          {
            humidityUnits: humidityToUnits(35),
            tempUnits: temperatureToUnits(12),
            lot_size: 50,
            productId: 1,
            checkpoints: [
              {
                warehouse: warehouseAccounts.welspun,
                in : {
                  humidityUnits: humidityToUnits(40),
                  tempUnits: temperatureToUnits(13),
                },
                out : {
                  humidityUnits: humidityToUnits(42),
                  tempUnits: temperatureToUnits(13),
                },
              },
              {
                warehouse: warehouseAccounts.antophyll,
                in : {
                  humidityUnits: humidityToUnits(54),
                  tempUnits: temperatureToUnits(16),
                },
                out : {
                  humidityUnits: humidityToUnits(65),
                  tempUnits: temperatureToUnits(19),
                },
              },
            ],
          },
        ],
      },
      {
        name: "Munch",
        price: 20,
        temperature: { min: -10, max: 30 },
        timeLimit: { min: 0, max: 1440 }, // 24 hour (i.e. 24 minutes)
        humidity: { min: 25, max: 70 },
        producer_name: "Nestle Pvt Ltd",
        image:
          "https://res.cloudinary.com/dp0ayty6p/image/upload/v1679820693/munch_b3wmt7.jpg",
        lots: [
          {
            humidityUnits: humidityToUnits(35),
            tempUnits: temperatureToUnits(15),
            lot_size: 50,
            productId: 1,
            checkpoints: [
              {
                warehouse: warehouseAccounts.welspun,
                in : {
                  humidityUnits: humidityToUnits(55),
                  tempUnits: temperatureToUnits(12),
                },
                out : {
                  humidityUnits: humidityToUnits(55),
                  tempUnits: temperatureToUnits(15),
                },
              },
              {
                warehouse: warehouseAccounts.antophyll,
                in : {
                  humidityUnits: humidityToUnits(54),
                  tempUnits: temperatureToUnits(16),
                },
                out : {
                  humidityUnits: humidityToUnits(65),
                  tempUnits: temperatureToUnits(19),
                },
              },
              {
                warehouse: warehouseAccounts.antophyll,
                in : {
                  humidityUnits: humidityToUnits(52),
                  tempUnits: temperatureToUnits(16),
                },
                out : {
                  humidityUnits: humidityToUnits(72),
                  tempUnits: temperatureToUnits(35),
                },
              },
            ],
          },
        ],
      },
    ],
    trucks: [
      {
        truckLicensPlate: "MH 06 EF 3259",
        pk: "0xa927de328fe2969939fa9667501e816a154f8a5228ab64edaec57d28cdee0f1c",
        address: "0xb80dB168Af9540a33A462D14a6d6ACfa09486B7e",
      },
      {
        truckLicensPlate: "MH 02 GF 5882",
        pk: "0xf67daaf5e236c749f9e0bcf68120d011a54dcfbe7881bdb0ac79f3d8ecefea6f",
        address: "0xEaB8854EFB669979D60c5B75101410B702B5072b",
      },
    ],
  },
  ITC: {
    pk: "0xc75475d22b8b87d8d181dbc3c967cc9ca0a285e11957642a92dbc44485fe8694",
    address: "0x40c94dAAE90B73162f22564B4E051d9AB2dFCAb9",
    name: " ITC Limited",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Bengaluru Corporate Head Quarters. ITC Infotechpark 18, Banaswadi Main Road, Maruthiseva Nagar, Bengaluru - 560005, India",
    products: [
      {
        name: "Sunfest Milkshake",
        price: 400,
        temperature: { min: -10, max: 20 },
        timeLimit: { min: 0, max: 60 }, // 1 minute
        humidity: { min: 30, max: 65 },
        producer_name: "ITC",
        lots: [
          {
            humidityUnits: humidityToUnits(55),
            tempUnits: temperatureToUnits(13),
            lot_size: 100,
            productId: 0,
          },
          {
            humidityUnits: humidityToUnits(45),
            tempUnits: temperatureToUnits(14),
            lot_size: 50,
            productId: 0,
          },
        ],
      },
    ],
  },
  Hindustan_Unilever: {
    pk: "0xa6fb7104b1894e91fdc7c8b8448b2a9e94eb5f0ad46c69df952c4ba5b37a440e",
    address: "0x35FCB8a9E8cf487Ad620037AF5D05CfF56a8eECe",
    name: "Hindustan Unilever Limited",
    physicalAddress:
      "Hindustan Unilever Limited, Unilever House, B. D. Sawant Marg, Chakala, Andheri (E), Mumbai - 400 099.",
    products: [
      {
        name: " Bru Coffee",
        price: 240,
        temperature: { min: -10, max: 20 },
        humidity: { min: 40, max: 75 },
        producer_name: "Hindustan Unilever Limited",
        image:
          "https://res.cloudinary.com/dp0ayty6p/image/upload/v1679820787/bru_niyzbv.jpg",
      },
    ],
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    trucks: [
      {
        truckLicensPlate: "MH 02 FF 8258",
        pk: "0x5768275da3a6d0ab9a13c2a52082f29917ab7e4fd3cf4caee84aa45e26d247c0",
        address: "0x43cCD3d3d064229224186d47eb5a6dd5FFb225B2",
      },
    ],
  },

  // Not created for now
  Britania: {
    pk: "0xea5bbf6d3768cf0e5605bedca4ebfce1b79f93505d0664987c359d8bd88f2d22",
    address: "0xC59C99Dba249c371b2Adaea7451a63854f38372F",
    name: "Britannia Industries",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,

    physicalAddress:
      "5/1A Hungerford Street, Kolkata -700 017 · Executive Office. Britannia Industries Limited ·",
    products: [
      {
        name: "Britania milky-bakes cookies",
        price: 50,
        temperature: { min: -10, max: 20 },

        humidity: { min: 40, max: 60 },
        producer_name: "Britania",
      },
    ],
  },
  Jubilant_FoodWorks: {
    pk: "0x6b650fb2bff15c7588915b6d07b0867d6427e48a1f07bae841e37bb7beb227d9",
    address: "0x207521246355b3f5c187a09f7195633df2D427E0",
    name: "Jubilant FoodWorks Limited",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Jubilant FoodWorks Limited. 15th Floor, Tower E Skymark One, Plot No. H – 10/A Sector 98, Noida- 201301, U.P., India",
    products: [
      {
        name: "	Domino's Pizza",
        price: 330,
        temperature: { min: -10, max: 20 },

        humidity: { min: 45, max: 75 },
        producer_name: "Jubilant_FoodWorks",
      },
    ],
  },
  Varun: {
    pk: "0x69f6f727c9131ae7cc742a2c873c6a4244ca0c82f6a3ab28e4f50d467c582f79",
    address: "0x0b63D4daab91a6f65c7A68D384e16ECD6DD0Ba1f",
    name: "VarunBeverages Limited ",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Adityapur Industrial Area Tata Kandra Main Rd Adityapur Jamshedpur",
    products: [
      {
        name: "Pepsi,Diet Pepsi",
        price: 40,
        temperature: { min: -10, max: 20 },

        humidity: { min: 22, max: 65 },
        producer_name: "Nestle Pvt Ltd",
      },
    ],
  },
  wibs: {
    pk: "47bdfd22594b27d21f279ce22d0b9d673ceae68960ac358892a3381ded8e70e7",
    address: "0xCCCA8B3c76a6bE3CB933109855f4956E5F6Dd776",
    name: "Western India Bakers Pvt. Ltd.",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Western India Bakers Pvt. Ltd A.P.M., Mafco Market Yard, Turbhe, Navi Mumbai-400703.",
    products: [
      {
        name: "Brown Bread",
        price: 40,
        temperature: { min: -10, max: 20 },

        humidity: { min: 45, max: 65 },
        producer_name: " Western India Bakers Pvt. Ltd ",
      },
    ],
  },
  MotherDairy: {
    pk: "0xe10d19342618f3e5b15ae5ad0a0a7d8ef5f8420d45750e8a5b3cd97180842906",
    address: "0x75BB9Df3f9B0c3c84cA604E4d5d99116A595E510",
    name: "Mother Dairy Foods",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Mother Dairy Fruit & Vegetable Pvt Ltd, A-3, NDDB House, Sector-1, Noida, Uttar Pradesh-201 301 (India)",
    products: [
      {
        name: "Ice creams ",
        price: 190,
        temperature: { min: -10, max: 20 },

        humidity: { min: 40, max: 60 },
        producer_name: "Mother Dairy ",
      },
    ],
  },
  Rasna: {
    pk: "0x8d2a005771dc75891ced998851114d53cc21295364f3d8b7f6c3e70c146d15b9",
    address: "0xF3F7834fFA6d74eBbA17887dc5aB81fb261e3BF3",
    name: "Rasna Internationals",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Rasna House, Opp. Sears Tower, Gulbai Tekra, Ahmedabad-380 015,",
    products: [
      {
        name: "Rasna Energy Drinks",
        price: 100,
        temperature: { min: -20, max: 10 },
        humidity: { min: 22, max: 75 },
        producer_name: "Rasna",
      },
    ],
  },
  AB_Mauri: {
    pk: "0x4d13b878d19adab6f80e8cef7d46b491387fc3e5b4d1138b532a6558f8c8c515",
    address: "0x375f7543402eE18363330e062c7e91C0ad5ffFCC",
    name: "AB Mauri India Pvt Ltd",
    reg_no: "34374789392@$WE323S@#@#42",
    phone: 9032328423,
    physicalAddress:
      "Plot No. 218 & 219 Bommasandra Jigani Link Road Bangalore / Bengaluru Karnataka , 560105",
    products: [
      {
        name: "cake mixes & concentrates ",
        price: 220,
        temperature: { min: -10, max: 20 },
        humidity: { min: 40, max: 60 },
        producer_name: "AB Mauri India Pvt Ltd",
        lots: [
          {
            humidityUnits: humidityToUnits(50),
            tempUnits: temperatureToUnits(16),
            lot_size: 50,
            productId: 0,
          },
        ],
      },
    ],
  },
};
