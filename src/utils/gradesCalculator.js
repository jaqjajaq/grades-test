/**
 * A collection of helper functions for calculating grades
 */

// Calculate the transmuted grade of an assessment --> [0,1]
export function transmuteGrade(score, total) {
    if (total === 0) throw new Error("Assessment total cannot be zero for transmutation.");

    const raw = Math.max(0, Math.min(1, (score / total)))

    /**
     * LSGH has specific line equations to transmute a raw grade percentage
     * Grade less than 0.65: y = (2/13)x + (13/20)
     * Grade greater/equal to 0.65: y = (5/7)x + (2/7)
     * 
     * Additional information: https://www.desmos.com/calculator/zfku53fv8c
     */

    let grade = 0;

    if (raw < 0.65) {
        grade = ((2/13)*raw) + (13/20)
    } else {
        grade = ((5/7)*raw) + (2/7)
    }

    return grade
}

// Calculate average for a list of assessments (subcategory grade)
export function calculateAssessmentAverage(assessments) {
    if (!assessments || assessments.length === 0) return 0;

    let sumOfPercentages = 0;
    
    assessments.forEach(assessment => {
        sumOfPercentages += transmuteGrade(assessment.score, assessment.total)
    });

    /*
    const sumOfPercentages = assessments.reduce((accumulator, assessment) => {
        return accumulator += transmuteGrade(assessment.score, assessment.total)
    })
    */

    return (sumOfPercentages / assessments.length)
}

// Semantic wrapper for calculateAssessmentAverage
export function calculateSubcategoryGrade(assessments) {
    return calculateAssessmentAverage(assessments)
}

// Calculate average for a list of subcategories (category grade)
export function calculateCategoryGrade(subcategories) {
    if (!subcategories || subcategories.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    subcategories.forEach((subcategory) => {
        // Calculate the subcategory's grade
        const subcategoryGrade = calculateSubcategoryGrade(subcategory.assessments);

        // Only include this subcategory if it has a weight and contributes a grade
        if (subcategory.weight > 0 && (subcategoryGrade > 0 || (subcategory.assessments && subcategory.assessments.length > 0))) {
            weightedSum += subcategoryGrade * subcategory.weight;
            totalWeight += subcategory.weight;
        }
    });

    return (weightedSum / totalWeight);
}

// Calculate average for a list of categories (subject grade)
export function calculateSubjectGrade(categories) {
    if (!categories || categories.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    categories.forEach((category) => {
        // Calculate the category's grade
        const categoryGrade = calculateCategoryGrade(category.subcategories);

        // Only include this subcategory if it has a weight and contributes a grade
        if (category.weight > 0 && (categoryGrade > 0 || (category.subcategories && category.subcategories.length > 0))) {
            weightedSum += categoryGrade * category.weight;
            totalWeight += category.weight;
        }
    });

    return (weightedSum / totalWeight);
}

/*
// Calculate general average (semester grade)
export function calculateGeneralAverage(subjects) {
    if (!subjects || subjects.length === 0) return 0;

    let sumOfPercentages = 0;

    subjects.forEach((category) => {
        sumOfPercentages += calculateSubjectGrade(subject.categories)
    });

    return (sumOfPercentages / subjects.length)
}

*/