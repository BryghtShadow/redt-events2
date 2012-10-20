<?php defined('SYSPATH') or die('No direct script access.');

class Policy_User_Login extends Policy {

	const REGISTRATION_COMPLETED = 1;
	const REGISTRATION_CLOSED    = 2;

	public function execute(Model_ACL_User $user, array $extras = NULL)
	{
		// If already logged in, registration has been completed
		if (Auth::instance()->logged_in())
		{
			return self::REGISTRATION_COMPLETED;
		}
		
		// Is registration allowed for new users?
		$open_reg = Kohana::$config->load('registration')->get('open_registration');
		
		if ($open_reg)
		{
			return TRUE;
		}
		
		return self::REGISTRATION_CLOSED;
	}
}