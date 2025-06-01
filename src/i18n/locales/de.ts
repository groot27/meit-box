export default {
  calendar: {
    title: 'Kalender',
    today: 'Heute',
    views: {
      month: 'Monat',
      week: 'Woche',
      day: 'Tag'
    },
    weekdays: {
      short: {
        sun: 'SO',
        mon: 'MO',
        tue: 'DI',
        wed: 'MI',
        thu: 'DO',
        fri: 'FR',
        sat: 'SA'
      },
      long: {
        sun: 'Sonntag',
        mon: 'Montag',
        tue: 'Dienstag',
        wed: 'Mittwoch',
        thu: 'Donnerstag',
        fri: 'Freitag',
        sat: 'Samstag'
      }
    },
    months: {
      long: {
        january: 'Januar',
        february: 'Februar',
        march: 'März',
        april: 'April',
        may: 'Mai',
        june: 'Juni',
        july: 'Juli',
        august: 'August',
        september: 'September',
        october: 'Oktober',
        november: 'November',
        december: 'Dezember'
      }
    },
    dateFormats: {
      monthAndYear: '{month} {year}',
      weekOf: 'Woche vom {date}'
    }
  },
  task: {
    modal: {
      create: 'Termin erstellen für {date}',
      save: 'Speichern',
      cancel: 'Abbrechen',
      continueToCreate: 'Weiter zur Erstellung',
      tabs: {
        task: 'Aufgabe',
        resource: 'Ressource',
        appointment: 'Termin',
        activity: 'Aktivität',
        documents: 'Dokumente',
        project: 'Projekt',
        resources: 'Ressourcen',
        otherDetails: 'Weitere Details'
      },
      sections: {
        taskDetails: {
          title: 'Aufgabendetails',
          order: 'Auftrag',
          taskTitle: 'Aufgabentitel',
          description: 'Beschreibung'
        },
        resourceDetails: {
          title: 'Ressourcendetails',
          timeRange: {
            title: 'Zeitraum',
            start: 'Startzeit',
            end: 'Endzeit'
          },
          taskDetails: {
            title: 'Aufgabendetails',
            order: 'Auftrag/Standort/Kunde',
            address: 'Adresse',
            taskTemplate: 'Aufgabenvorlage',
            description: 'Beschreibung'
          },
          resources: {
            title: 'Ressourcen',
            skill: 'Fähigkeit',
            userQuantity: 'Benutzeranzahl',
            ratePerHour: 'Stundensatz',
            dress: 'Kleidung'
          }
        },
        appointmentDetails: {
          title: 'Termindetails',
          name: 'Terminname',
          username: 'Benutzername',
          adminGuest: 'Admin Gast',
          datetime: 'Datum & Zeit'
        },
        activity: {
          title: 'Aktivität',
          filters: {
            all: 'Alle',
            comments: 'Kommentare',
            history: 'Verlauf'
          }
        },
        documents: {
          title: 'Dokumente',
          upload: 'Bild hochladen',
          dragDrop: 'Bilder hier ablegen oder klicken zum Auswählen',
          noDocuments: 'Noch keine Dokumente hochgeladen'
        }
      }
    },
    colors: {
      blue: 'Blau',
      green: 'Grün',
      red: 'Rot',
      yellow: 'Gelb',
      purple: 'Lila'
    },
    editSidebar: {
      title: 'Aufgabe bearbeiten',
      close: 'Schließen',
      saveChanges: 'Änderungen speichern',
      time: 'Zeit',
      title: 'Titel',
      description: 'Beschreibung',
      color: 'Farbe',
      order: 'Auftrag',
      taskTitle: 'Aufgabentitel',
      tabs: {
        project: {
          order: "Auftrag",
          taskTitle: "Aufgabentitel",
          taskStatus: "Aufgabenstatus",
          permission: "Berechtigung",
          locationCategory: "Standortkategorie",
          location: "Standort",
          updateTasks: "Aufgaben aktualisieren",
          startEndDate: "Start-/Enddatum",
          time: "Zeit",
          taskDescription: "Aufgabenbeschreibung",
          status: {
            done: "Erledigt",
            notConfirmed: "Nicht bestätigt",
            confirmed: "Bestätigt"
          },
          permissions: {
            employee: "Mitarbeiter",
            projectManager: "Projektmanager",
            admin: "Administrator"
          },
          locations: {
            berlin: "Berlin",
            dessau: "Dessau"
          },
          updateOptions: {
            all: "Ja (Alle Aufgaben)",
            current: "Nein (Nur aktuelle Aufgabe)"
          }
        },
        resources: {
          upcoming: "Bevorstehend",
          name: "Name",
          count: "$/Std",
          details: "Details",
          status: "Status",
          employee: "Mitarbeiter",
          vehicle: "Fahrzeug",
          device: "Gerät",
          open: "Offen"
        },
        otherDetails: {
          requiredSkills: "Erforderliche Fähigkeiten",
          dress: "Kleidung",
          language: "Sprache",
          teamLeadDescription: "Teamleiter Beschreibung",
          teamLeadContactPerson: "Teamleiter Kontaktperson",
          notificationTemplate: "Benachrichtigungsvorlage",
          languages: {
            doesntMatter: "Egal",
            english: "Englisch",
            german: "Deutsch"
          }
        }
      }
    },
    infoModal: {
      title: 'Aufgabendetails',
      share: 'Teilen',
      copy: 'Kopieren',
      edit: 'Bearbeiten',
      close: 'Schließen',
      noTitle: 'Kein Titel gesetzt',
      noTime: 'Keine Zeit gesetzt',
      noAddress: 'Keine Adresse gesetzt',
      labels: {
        title: 'Titel',
        time: 'Zeit',
        address: 'Adresse'
      }
    }
  },
  leftSidebar: {
    search: {
      options: {
        taskId: 'Aufgaben-ID',
        customer: 'Kunde',
        userName: 'Benutzername',
        location: 'Standort'
      },
      placeholder: 'Suchen...'
    },
    filter: {
      title: 'Filter',
      appliedUsers: 'Zugewiesene Benutzer',
      missingUsers: 'Fehlende Benutzer',
      truck: 'LKW',
      confirmed: 'Bestätigt',
      trash: 'Papierkorb'
    },
    taskFilter: {
      title: 'Aufgabenfilter',
      noSkill: 'Keine Fähigkeit',
      general: 'Allgemein',
      e2aSkill: 'E2a Basis=12,00 Fähigkeit',
      e2bSkill: 'E2b Basis=13,00 Fähigkeit'
    },
    locations: {
      title: 'Standorte',
      dessau: 'Dessau',
      berlin: 'Berlin',
      all: 'Alle'
    },
    settings: {
      title: 'Einstellungen'
    },
    printWorkPlan: {
      title: 'Arbeitsplan drucken',
      dailySheet: 'Tagesblatt',
      weeklySheet: 'Wochenblatt',
      monthlySheet: 'Monatsblatt',
      selectData: 'Daten auswählen'
    },
    cardSettings: {
      title: 'Karteneinstellungen',
      taskTitle: 'Aufgabentitel',
      showStartTime: 'Startzeit anzeigen',
      showEmployees: 'Mitarbeiter anzeigen',
      showDevices: 'Geräte anzeigen',
      customerShort: 'Kunde (kurz)',
      showExtendedData: 'Erweiterte Daten anzeigen'
    },
    extendedData: {
      title: 'Erweiterte Daten anzeigen',
      order: 'Auftrag',
      vehicleCustomField: 'Fahrzeug-Benutzerdefiniertes Feld',
      validityFormDocument: 'Gültigkeit Formulardokument'
    }
  }
}