const YEAR = 2022;
const SEMESTER = 1;

export default async function getAllInfo() {
  const GROUP_BY_FACULTIES = {};
  const MODULES = [];
  await fetch(`https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/moduleInfo.json`)
    .then((response) => response.json())
    .then((data) => {
      for (const key in data) {
        const faculty = data[key].faculty;
        const department = data[key].department;
        const moduleCode = data[key].moduleCode;
        const moduleCredit = data[key].moduleCredit;
        const title = data[key].title;

        MODULES.push(moduleCode);

        if (!GROUP_BY_FACULTIES[faculty]) {
          GROUP_BY_FACULTIES[faculty] = {};
        }

        if (!GROUP_BY_FACULTIES[faculty][department]) {
          GROUP_BY_FACULTIES[faculty][department] = {};
        }

        if (!GROUP_BY_FACULTIES[faculty][department][moduleCode]) {
          GROUP_BY_FACULTIES[faculty][department][moduleCode] = {
            title: title,
            moduleCredit: moduleCredit,
          };
        }
      }
    });

  const FAC_ARR = Object.keys(GROUP_BY_FACULTIES);
  FAC_ARR.sort();

  const INFO = {
    faculties: FAC_ARR,
    modules: MODULES,
    groupByFaculties: GROUP_BY_FACULTIES,
  };
  return INFO;
}

export function transformToMenuItems(itemArr) {
  const items = [];
  for (const item in itemArr) {
    const module = itemArr[item];
    items.push({
      value: { moduleCode: module.moduleCode, title: module.title },
      label: module.moduleCode,
    });
  }
  return items;
}

export async function getAllFaculties() {
  const faculties = {};
  await fetch(`https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/moduleInfo.json`)
    .then((response) => response.json())
    .then((data) => {
      for (const k in data) {
        if (!faculties[data[k].faculty]) {
          faculties[data[k].faculty] = true;
        }
      }
    });

  const res = Object.keys(faculties);
  res.sort();
  return res;
}

export async function getDepartmentsInFaculty(faculty) {
  const departments = {};
  await fetch(`https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/moduleInfo.json`)
    .then((response) => response.json())
    .then((data) => {
      for (const k in data) {
        if (data[k].faculty == faculty) {
          departments[data[k].department] = true;
        }
      }
    });
  const res = Object.keys(departments);
  res.sort();
  return res;
}

export async function getModulesInDepartment(faculty, department) {
  const modules = [];
  await fetch(`https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/moduleInfo.json`)
    .then((response) => response.json())
    .then((data) => {
      for (const k in data) {
        if (data[k].department == department && data[k].faculty == faculty) {
          modules.push({
            moduleCode: data[k].moduleCode,
            title: data[k].title,
          });
        }
      }
    });
  modules.sort((x, y) => {
    return x.moduleCode < y.moduleCode ? -1 : 1;
  });
  return modules;
}

export async function getModulesInFaculty(faculty) {
  const modules = [];
  await fetch(`https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/moduleInfo.json`)
    .then((response) => response.json())
    .then((data) => {
      for (const k in data) {
        if (data[k].faculty == faculty) {
          modules.push({
            moduleCode: data[k].moduleCode,
            title: data[k].title,
          });
        }
      }
    });
  modules.sort((x, y) => {
    return x.moduleCode < y.moduleCode ? -1 : 1;
  });
  return modules;
}

export async function getAllModules() {
  const modules = [];
  await fetch(`https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/moduleInfo.json`)
    .then((response) => response.json())
    .then((data) => {
      for (const k in data) {
        modules.push({
          moduleCode: data[k].moduleCode,
          title: data[k].title,
        });
      }
    });
  modules.sort((x, y) => {
    return x.moduleCode < y.moduleCode ? -1 : 1;
  });

  return modules;
}

export async function checkModuleExists(module) {
  var ok = false;
  await fetch(
    `https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/modules/${module}.json`
  )
    .then((r) => {
      ok = r.ok;
    })
    .catch((ok = false));

  return ok;
}

export async function getExamDate(moduleCode) {
  let examDate = "";
  await fetch(
    `https://api.nusmods.com/v2/${YEAR}-${YEAR + 1}/modules/${moduleCode}.json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data["semesterData"].length >= SEMESTER) {
        const semesterData = data["semesterData"][SEMESTER - 1];
        if (semesterData["examDate"]) {
          examDate = semesterData["examDate"];
        }
      }
    })
    .catch((err) => console.log(err));
  return examDate;
}
