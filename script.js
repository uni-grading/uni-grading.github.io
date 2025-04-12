function validateInput(input) {
    let value = parseFloat(input.value);
    
    if (isNaN(value)) {
        input.value = "";
        return;
    }
    
	input.value = Math.min(Math.max(value, 0), 100);
}

function switchPathway() {
    const pathway = document.getElementById('pathway').value;
    const programmingModules = document.querySelectorAll('.programming-module');
    const modellingModules = document.querySelectorAll('.modelling-module');
    
    programmingModules.forEach(module => module.style.display = pathway === 'programming' ? 'flex' : 'none');
    modellingModules.forEach(module => module.style.display = pathway === 'programming' ? 'none' : 'flex');
    
    calculateGrades();
}

function getModuleGrade(id) {
    const value = parseFloat(document.getElementById(id).value);
    return isNaN(value) ? 0 : value;
}

function calculateYear2Grade() {
    const pathway = document.getElementById('pathway').value;
    
    const gdd = getModuleGrade('y2-gdd');
    const agile = getModuleGrade('y2-agile');
    const research = getModuleGrade('y2-research');
    const career = getModuleGrade('y2-career');
    const installation = getModuleGrade('y2-installation');
    
    let year2Grade = 0;
    
    if (pathway === 'programming') {
        const gamesTech = getModuleGrade('y2-games-tech');
        year2Grade = (gdd * 2) + agile + research + career + installation + (gamesTech * 2);
    } else {
        const gert = getModuleGrade('y2-gert');
        const animation = getModuleGrade('y2-animation');
        year2Grade = (gdd * 2) + agile + research + career + installation + gert + animation;
    }
    year2Grade = year2Grade / 8;
    
    return Math.round(year2Grade * 100) / 100;
}

function calculateYear3Grade() {
    const modules = [
        { name: 'y3-group', grade: getModuleGrade('y3-group'), credits: 30 },
        { name: 'y3-individual', grade: getModuleGrade('y3-individual'), credits: 30 },
        { name: 'y3-rapid', grade: getModuleGrade('y3-rapid'), credits: 15 },
        { name: 'y3-realities', grade: getModuleGrade('y3-realities'), credits: 15 },
        { name: 'y3-shader', grade: getModuleGrade('y3-shader'), credits: 15 },
        { name: 'y3-ai', grade: getModuleGrade('y3-ai'), credits: 15 }
    ];
    
    const individualModule = modules.find(m => m.name === 'y3-individual');
    const otherModules = modules.filter(m => m.name !== 'y3-individual').sort((a, b) => b.grade - a.grade);
    
    let totalGradePoints = individualModule.grade * individualModule.credits;
    let totalCredits = individualModule.credits;
    
    for (let module of otherModules) {
        if (totalCredits + module.credits <= 90) {
            totalGradePoints += module.grade * module.credits;
            totalCredits += module.credits;
        }
    }
    
    return Math.round((totalCredits > 0 ? totalGradePoints / totalCredits : 0) * 100) / 100;
}

function calculateFinalGrade(year2Grade, year3Grade) {
    const method1 = year3Grade * 0.8 + year2Grade * 0.2;     // 80/20 split
    const method2 = year3Grade * 0.9 + year2Grade * 0.1;     // 90/10 split
    
    if (method1 >= method2) {
        return {
            grade: method1,
            method: "80/20 weighting will be used with those grades (Year 3: 80%, Year 2: 20%)"
        };
    } else {
        return {
            grade: method2,
            method: "90/10 weighting will be used with those grades (Year 3: 90%, Year 2: 10%)"
        };
    }
}

function calculateGrades() {
    const year2Grade = calculateYear2Grade();
    const year3Grade = calculateYear3Grade();
    
    const finalGradeResult = calculateFinalGrade(year2Grade, year3Grade);
    
    document.getElementById('year2-result').textContent = year2Grade.toFixed(2);
    document.getElementById('year3-result').textContent = year3Grade.toFixed(2);
    document.getElementById('final-result').textContent = finalGradeResult.grade.toFixed(0);
    document.getElementById('calculation-method').textContent = finalGradeResult.method;
}

document.addEventListener('DOMContentLoaded', function() {
    switchPathway();
    
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            calculateGrades();
        });
    });
});