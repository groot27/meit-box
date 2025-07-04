export default {
  calendar: {
    title: "Kalender",
    today: "Heute",
    views: {
      month: "Monat",
      week: "Woche",
      day: "Tag",
    },
    weekdays: {
      short: {
        sun: "SO",
        mon: "MO",
        tue: "DI",
        wed: "MI",
        thu: "DO",
        fri: "FR",
        sat: "SA",
      },
      long: {
        sun: "Sonntag",
        mon: "Montag",
        tue: "Dienstag",
        wed: "Mittwoch",
        thu: "Donnerstag",
        fri: "Freitag",
        sat: "Samstag",
      },
    },
    months: {
      long: {
        january: "Januar",
        february: "Februar",
        march: "März",
        april: "April",
        may: "Mai",
        june: "Juni",
        july: "Juli",
        august: "August",
        september: "September",
        october: "Oktober",
        november: "November",
        december: "Dezember",
      },
    },
    dateFormats: {
      monthAndYear: "{month} {year}",
      weekOf: "Woche vom {date}",
    },
    upcoming: {
      title: "geplante Aufgaben",
      type: "Typ",
      customer: "Kunde",
      orderNumber: "Projekt-Nummer",
      loadMore: "mehr Laden",
      search: "Ressourcen suchen",
    },
  },
  orders: {
    header: {
      title: "Alle Aufträge",
      moreOptions: "Weitere Optionen",
      createOrder: "Auftrag erstellen",
    },
    filters: {
      title: "Filter",
      clear: "Alle löschen",
      search: "Suchen",
      searchPlaceholder: "Aufträge suchen...",
      startDate: "Startdatum",
      endDate: "Enddatum",
      orderStatus: "Auftragsstatus",
      orderCategory: "Auftragskategorie",
      projectManager: "Projektmanager",
      customer: "Kunde",
      contactPerson: "Kontaktperson",
      allOrderStatus: "Alle Auftragsstatus",
      allCategories: "Alle Kategorien",
      selectProjectManager: "Projektmanager auswählen",
      selectCustomer: "Kunde auswählen",
      selectContactPerson: "Kontaktperson auswählen",
    },
    table: {
      filter: "Filter",
      print: "Drucken",
      printPlus: "Drucken Plus",
      export: "Exportieren",
      delete: "löschen",
      columns: "Auftrag#",
      selectColumns: "Spalten auswählen",
      showing: "Zeige",
      to: "bis",
      of: "von",
      results: "Ergebnisse",
      previous: "Vorherige",
      next: "Nächste",
      itemsPerPage: "Elemente pro Seite",
      headers: {
        order_number: "Bestellnummer",
        custom_order_number: "Benutzerdefinierte Bestellnummer",
        get_order_documents: "Angebotsnummer",
        order_status_id: "Status",
        order_application_status_id: "Antragsstatus",
        get_customer: "Kunde",
        category_name: "Bestellkategorie",
        order_location: "Standort",
        start_date: "Startdatum",
        end_date: "Enddatum",
        custom_description: "Benutzerdefinierte Beschreibung",
        building: "Gebäude",
        date_of_receipt: "Datum des Eingangs/der Anfrage",
        submission_date: "Einreichungsdatum/-frist",
        estimated_delivery_date: "Voraussichtliches Lieferdatum",
        link_to_windows: "Link zu Windows",
        project_title: "Projekttitel",
        customer_project: "Kundenprojekt",
        customer_reference: "Kundenreferenz",
      },
    },
    status: {
      pending: "Ausstehend",
      inProgress: "In Bearbeitung",
      completed: "Abgeschlossen",
      cancelled: "Storniert",
    },
    categories: {
      development: "Entwicklung",
      maintenance: "Wartung",
      consulting: "Beratung",
      support: "Support",
    },
    priority: {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
    },
  },
  task: {
    modal: {
      create: "Termin erstellen für {date}",
      save: "Speichern",
      cancel: "Abbrechen",
      continueToCreate: "Weiter zur Erstellung",
      tabs: {
        task: "Aufgabe",
        resource: "Ressource",
        appointment: "Termin",
        activity: "Aktivität",
        documents: "Dokumente",
        project: "Projekt",
        resources: "Ressourcen",
        otherDetails: "Qualifikation",
      },
      sections: {
        taskDetails: {
          title: "Aufgabendetails",
          order: "Auftrag",
          taskTitle: "Aufgabentitel",
          description: "Beschreibung",
        },
        resourceDetails: {
          title: "Ressourcendetails",
          timeRange: {
            title: "Zeitraum",
            start: "Startzeit",
            end: "Endzeit",
          },
          taskDetails: {
            title: "Aufgabendetails",
            order: "Auftrag/Standort/Kunde",
            address: "Adresse",
            taskTemplate: "Aufgabenvorlage",
            description: "Beschreibung",
          },
          resources: {
            title: "Ressourcen",
            skill: "Fähigkeit",
            userQuantity: "Benutzeranzahl",
            ratePerHour: "Stundensatz",
            dress: "Kleidung",
          },
        },
        appointmentDetails: {
          title: "Termindetails",
          name: "Terminname",
          username: "Benutzername",
          adminGuest: "Admin Gast",
          datetime: "Datum & Zeit",
        },
        activity: {
          title: "Aktivität",
          filters: {
            all: "Alle",
            comments: "Kommentare",
            history: "Verlauf",
          },
        },
        documents: {
          title: "Dokumente",
          upload: "Bild hochladen",
          dragDrop: "Bilder hier ablegen oder klicken zum Auswählen",
          noDocuments: "Noch keine Dokumente hochgeladen",
        },
      },
    },
    colors: {
      blue: "Blau",
      green: "Grün",
      red: "Rot",
      yellow: "Gelb",
      purple: "Lila",
    },
    editSidebar: {
      title: "Aufgabe bearbeiten",
      close: "Schließen",
      discard: "Abbrechen",
      saveChanges: "speichern",
      time: "Zeit",
      description: "Beschreibung",
      color: "Farbe",
      order: "Auftrag",
      taskTitle: "Aufgabentitel",
      tabs: {
        project: {
          order: "Projekt",
          taskTitle: "Aufgaben Titel",
          taskStatus: "Status Aufgaben",
          permission: "Zugriffsrechte *",
          locationCategory: "Ort-Kategorie",
          location: "Einsatzort",
          locationDesc: "Ortsbeschreibung",
          updateTasks: "Aufgaben aktualisieren",
          startEndDate: "Datum von/bis",
          time: "Uhrzeit",
          taskDescription: "Beschreibung",
          showDesc: "anzeigen Ortsbeschreibung",
          status: {
            done: "Erledigt",
            notConfirmed: "Nicht bestätigt",
            confirmed: "Bestätigt",
          },
          permissions: {
            employee: "Mitarbeiter",
            manager: "Projektleiter",
            admin: "Admin",
            all: "Alle",
          },
          locations: {
            berlin: "Berlin",
            dessau: "Dessau",
          },
          updateOptions: {
            all: "Ja (Alle Aufgaben)",
            current: "Nein (Nur aktuelle Aufgabe)",
          },
        },
        resources: {
          upcoming: "Bevorstehend",
          name: "Name",
          count: "€/Std",
          details: "Details",
          status: "Status",
          employee: "Mitarbeiter",
          vehicle: "Fahrzeug",
          device: "Gerät",
          open: "Offen",
          statuses: {
            confirmed: "Bestätigt",
            checked_out: "Checked Out",
            no_show: "No Show",
            prechecked: "Vorgecheckt",
            open: "offen",
            planned: "geplant",
            reject: "Abgelehnt",
            remove: "Löschen",
            checked_in: "Checked In",
          },
        },
        otherDetails: {
          requiredSkills: "Task Bereich",
          dress: "Arbeitskleidung",
          language: "Sprache",
          teamLeadDescription: "Hinweis für TL",
          teamLeadContactPerson: "Kontaktperson für TL",
          notificationTemplate: "Vorlage Benachrichtigung",
          languages: {
            doesntMatter: "Egal",
            english: "Englisch",
            german: "Deutsch",
          },
        },
        document: {
          placeHolder: "Dateien hier anklicken oder ablegen",
        },
      },
    },
    infoModal: {
      title: "Aufgabendetails",
      share: "Teilen",
      copy: "Kopieren",
      edit: "Bearbeiten",
      close: "Schließen",
      noTitle: "Kein Titel gesetzt",
      noTime: "Keine Zeit gesetzt",
      noAddress: "Keine Adresse gesetzt",
      noCustomer: "Kein Kunde",
      details: "Details",
      resources: "Ressourcen",
      labels: {
        title: "Titel",
        time: "Zeit",
        address: "Adresse",
      },
    },
    archiveModal: {
      archive: "Möchten Sie diese Aufgabe archivieren?",
      restore: "Möchten Sie diese Aufgabe wiederherstellen?",
      yes: "Ja",
      no: "Nein",
    },
  },
  leftSidebar: {
    search: {
      options: {
        taskId: "Aufgaben-ID",
        customer: "Kunde",
        userName: "Benutzername",
        location: "Standort",
      },
      placeholder: "Suchen...",
    },
    filter: {
      title: "Filter",
      appliedUsers: "Zugewiesene Benutzer",
      missingUsers: "Fehlende Benutzer",
      truck: "LKW",
      confirmed: "Bestätigt",
      trash: "Papierkorb",
    },
    taskFilter: {
      title: "Aufgabenfilter",
      noSkill: "Keine Fähigkeit",
      general: "Allgemein",
      e2aSkill: "E2a Basis=12,00 Fähigkeit",
      e2bSkill: "E2b Basis=13,00 Fähigkeit",
    },
    locations: {
      title: "Standorte",
      dessau: "Dessau",
      berlin: "Berlin",
      all: "Alle",
    },
    settings: {
      title: "Einstellungen Bereiche",
    },
    printWorkPlan: {
      title: "Arbeitsplan drucken",
      dailySheet: "Tagesblatt",
      weeklySheet: "Wochenblatt",
      monthlySheet: "Monatsblatt",
      selectData: "Daten auswählen",
    },
    cardSettings: {
      title: "Karteneinstellungen",
      taskTitle: "Aufgabentitel",
      showStartTime: "Startzeit anzeigen",
      showEmployees: "Mitarbeiter anzeigen",
      showDevices: "Geräte anzeigen",
      customerShort: "Kunde (kurz)",
      showExtendedData: "Fahrzeug anzeigen",
    },
    extendedData: {
      title: "Erweiterte Daten anzeigen",
      order: "Auftrag",
      vehicleCustomField: "Fahrzeug-Benutzerdefiniertes Feld",
      validityFormDocument: "Gültigkeit Formulardokument",
    },
  },
  common: {
    employee: "Mitarbeiter",
    vehicle: "Fahrzeug",
    device: "Gerät",
    placeholder: {
      employee: "Mitarbeiter auswählen",
      vehicle: "Fahrzeug auswählen",
      device: "Gerät auswählen",
      contactPerson: "Kontaktperson auswählen",
      dress: "Kleidung auswählen",
      notificationTemplate: "Benachrichtigungsvorlage auswählen",
      requiredSkill: "Erforderliche Fähigkeit auswählen",
    },
    ordersEmpty: "Kein Auftrag gefunden",
    notifications: {
      title: "Benachrichtigungen",
      markAllRead: "Alle als gelesen",
      empty: "Keine Benachrichtigungen",
    },
  },
  dashboard: {
    header: {
      title: "Startseite",
      search: {
        title: "Suchen",
        order: "Projekt",
        user: "Benutzerliste",
        invoice: "Rechnung",
        offer: "Angebot",
      },
      export: "Daten exportieren",
      refresh: "Aktualisieren",
    },
    stats: {
      totalValue: "Gesamtwert",
      pending: "Ausstehende Aufträge",
      "in-progress": "In Bearbeitung",
      completed: "Abgeschlossen",
      cancelled: "Storniert",
      noStatus: "Kein Status",
    },
    filters: {
      title: "Filter",
      clear: "Alle löschen",
      search: "Suchen",
      searchPlaceholder: "Aufträge, Kunden suchen...",
      status: "Auftragsstatus",
      allStatus: "Alle Status",
      dateRange: "Datumsbereich",
      startDate: "Startdatum",
      endDate: "Enddatum",
      mapSettings: "Karteneinstellungen",
      showLabels: "Beschriftungen anzeigen",
      clusterMarkers: "Marker gruppieren",
    },
    map: {
      orderDetails: "Auftragsdetails",
      title: "Titel",
      customer: "Kunde",
      orderNumber: "Auftragsnummer",
      status: "Status",
      totalAmount: "Gesamtbetrag",
      location: "Standort",
      legend: "Legende",
      loading: "Kartendaten werden geladen...",
      productList: "Produktliste",
      noDate: "Kein Datum",
    },
    pinnedOrders: "Angepinnte Aufträge",
  },
  help: {
    title: "Hilfe erhalten",
    call: "Anruf erhalten",
    chat: "Chat",
    bug: "Fehler melden",
    support: "Support anrufen",
  },
};
