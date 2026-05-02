use anchor_lang::prelude::*;

declare_id!("3EGSobKGcyENv8jQTeZQDYtxbEe1C7PEvPkyZXVwjSZR"); 

#[program]
pub mod lumina {
    use super::*;

pub fn initialize_course(ctx: Context<InitializeCourse>, course_id: String, title: String) -> Result<()> {
        let course = &mut ctx.accounts.course;
        course.instructor = ctx.accounts.instructor.key();
        course.course_id = course_id;
        course.title = title; // Ownership moves here
        
        // We use course.title below since it now owns the string data
        msg!("Course '{}' initialized by {}", course.title, course.instructor);
        Ok(())
    }

    pub fn issue_certificate(ctx: Context<IssueCertificate>, learner: Pubkey) -> Result<()> {
        let certificate = &mut ctx.accounts.certificate;
        let clock = Clock::get()?;
        
        certificate.learner = learner;
        certificate.course = ctx.accounts.course.key();
        certificate.issue_date = clock.unix_timestamp;
        
        msg!("Certificate issued to learner {} for course {}", learner, certificate.course);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(course_id: String)]
pub struct InitializeCourse<'info> {
    #[account(
        init,
        payer = instructor,
        space = 8 + 32 + 4 + 50 + 4 + 100, // Size allocation: discriminator + pubkey + string prefixes + string data
        seeds = [b"course", instructor.key().as_ref(), course_id.as_bytes()],
        bump
    )]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub instructor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(learner: Pubkey)]
pub struct IssueCertificate<'info> {
    #[account(
        init,
        payer = instructor,
        space = 8 + 32 + 32 + 8, // Size allocation: discriminator + pubkey + pubkey + i64
        seeds = [b"certificate", course.key().as_ref(), learner.as_ref()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
    #[account(
        mut,
        has_one = instructor // CRITICAL: This ensures ONLY the instructor who created the course can issue a certificate for it.
    )]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub instructor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Course {
    pub instructor: Pubkey,
    pub course_id: String,
    pub title: String,
}

#[account]
pub struct Certificate {
    pub learner: Pubkey,
    pub course: Pubkey,
    pub issue_date: i64,
}