import { format } from "date-fns";

const config = {
  table: {
    booleanOptions: {
      true: { label: "Yes" },
      false: { label: "No" },
    },
    columns: [
      {
        key: "orderNo",
        label: "Numero commandes",
        visibility: true,
        sortable: true,
        editable: false,
        type: "text",
        defaultValue: "001",
      },
      {
        key: "customerNo",
        label: "Numero client",
        visibility: true,
        sortable: true,
        editable: true,
        type: "text",
        defaultValue: "CBE005",
      },
      {
        key: "customerName",
        label: "Nom du client",
        visibility: true,
        sortable: true,
        editable: true,
        type: "text",
        defaultValue: "David",
      },
      {
        key: "orderedQuantity",
        label: "Quantite commandes",
        visibility: true,
        sortable: true,
        editable: true,
        type: "number",
        defaultValue: 70,
        style: {
          border: "2px solid black",
          "border-radius": "10px 10px 10px 0",
        },
      },
      {
        key: "orderDate",
        label: "Date de la commande",
        visibility: true,
        sortable: true,
        editable: true,
        type: "date",
        defaultValue: new Date().toLocaleDateString(),
      },
      {
        key: "orderStatus",
        label: "Status de la commande",
        visibility: true,
        sortable: false,
        editable: true,
        type: "select",
        defaultValue: 0,
        optionsKey: "orderStatus",
      },
      {
        key: "printedStatus",
        label: "Printed",
        visibility: true,
        sortable: false,
        editable: true,
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "deliveryDate",
        label: "Date de livraison",
        visibility: true,
        sortable: true,
        editable: false,
        type: "date",
        defaultValue: new Date().toLocaleDateString(),
      },
    ],

    unhideableColumns: ["orderNo"],
    searchableColumns: [
      "orderNo",
      "customerNo",
      "customerName",
      "orderedQuantity",
    ],

    rowsPerPage: 10,
    defaultSort: "asc",
    sortingOrders: [
      { label: "Ascending Order", value: "asc", icon: "arrow-up-a-z" },
      { label: "Descending Order", value: "desc", icon: "arrow-down-z-a" },
    ],
    options: {
      orderStatus: {
        0: { label: "brouillon", class: "tag is-dark" },
        1: { label: "en cours", class: "tag is-warning is-light" },
        2: { label: "valide", class: "tag is-success is-light" },
        3: { label: "rejete", class: "tag is-danger is-light" },
      },
    },
  },

  clientTable: {
    columns: [
      {
        key: "customerNo",
        label: "Numero client",
        visibility: true,
        editable: false,
        type: "text",
        defaultValue: "CBE001",
      },
      {
        key: "customerName",
        label: "Nom du client",
        visibility: true,
        editable: true,
        type: "text",
        defaultValue: "Emy",
      },
      {
        key: "deliveryDays",
        label: "Jours de livraison",
        visibility: true,
        editable: true,
        type: "number",
        defaultValue: 12,
      },
      {
        key: "maxCommandNo",
        label: "Maximum Commands",
        editable: true,
        visibility: true,
        type: "number",
        defaultValue: 12,
      },
      {
        key: "customerType",
        label: "Customer Type",
        editable: true,
        visibility: true,
        type: "select",
        defaultValue: "Type 1",
        optionsKey: "customerType",
      },
    ],
    options: {
      customerType: {
        0: { label: "Type 1" },
        1: { label: "Type 2" },
        2: { label: "Type 3" },
      },
    },
  },

  customerTypeTable: {
    columns: [
      {
        key: "id",
        label: "Type",
        visibility: true,
        editable: false,
        type: "text",
      },

      {
        key: "description",
        label: "Description",
        visibility: true,
        editable: false,
        type: "text",
      },

      {
        key: "namingSeries",
        label: "Naming Series",
        visibility: true,
        editable: true,
        type: "select",
      },
    ],
  },

  namingSeriesTable: {
    columns: [
      {
        key: "id",
        label: "Id",
        visibility: true,
        editable: false,
        type: "text",
      },
      {
        key: "startNo",
        label: "Numero de debut",
        visibility: true,
        editable: false,
        type: "text",
      },
      {
        key: "endNo",
        label: "Numero de fin",
        visibility: true,
        editable: false,
        type: "text",
      },
      {
        key: "lastUsedNo",
        label: "Dernier numero utilise",
        visibility: true,
        editable: false,
        type: "text",
      },
      {
        key: "isAutomatic",
        label: "Automatic",
        visibility: true,
        editable: false,
        type: "boolean",
      },
      {
        key: "isManual",
        label: "Manual",
        visibility: true,
        editable: false,
        type: "boolean",
      },
      {
        key: "isDefault",
        label: "Default",
        visibility: true,
        editable: false,
        type: "boolean",
      },
    ],
  },
};


export default config;